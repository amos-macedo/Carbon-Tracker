import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
  }

  try {
    let currentUrl = '';
    let forecastUrl = '';

    if (city) {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
    } else if (lat && lng) {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=pt_br`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=pt_br`;
    } else {
      return NextResponse.json({ error: 'Cidade ou coordenadas são necessárias' }, { status: 400 });
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json().catch(() => ({}));
      return NextResponse.json({ 
        error: errorData.message || 'Erro ao buscar dados atuais' 
      }, { status: currentResponse.status });
    }

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json().catch(() => ({}));
      return NextResponse.json({ 
        error: errorData.message || 'Erro ao buscar previsão' 
      }, { status: forecastResponse.status });
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json()
    ]);

    console.log('Primeira previsão horária:', forecastData.list[0]);
    console.log('Pop da primeira previsão:', forecastData.list[0]?.pop);

    return NextResponse.json({
      current: currentData,
      forecast: forecastData
    });

  } catch (error) {
    console.error('Erro na API do clima:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}