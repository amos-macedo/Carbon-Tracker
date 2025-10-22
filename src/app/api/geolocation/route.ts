import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
  }

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Coordenadas são necessárias' }, { status: 400 });
  }

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${apiKey}`;
    
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {

      console.warn('Erro na API de geolocalização, retornando localização padrão');
      return NextResponse.json({
        city: 'Local Desconhecido',
        state: '',
        countryCode: '',
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
    }

    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {

      console.warn('Localização não encontrada nas coordenadas:', { lat, lng });
      return NextResponse.json({
        city: 'Local Desconhecido',
        state: '',
        countryCode: '',
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
    }

    const location = geoData[0];
    
    return NextResponse.json({
      city: location.name || 'Local Desconhecido',
      state: location.state || '',
      countryCode: location.country || '',
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });

  } catch (error) {
    console.error('Erro na API de geolocalização, retornando padrão:', error);
    return NextResponse.json({
      city: 'Local Desconhecido',
      state: '',
      countryCode: '',
      lat: lat ? parseFloat(lat) : 0,
      lng: lng ? parseFloat(lng) : 0
    });
  }
}