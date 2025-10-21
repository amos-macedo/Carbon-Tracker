// src/app/api/estimates/route.ts
import { NextRequest } from 'next/server';


export async function GET(request: NextRequest) {

  const API_KEY = process.env.API_KEY || "c8931f2cdef10ed93b8fe825e533915e";
  const BASE_URL =
  process.env.OPEN_WEATHER_URL || "https://api.openweathermap.org/data/2.5";

  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

    let url;
  if (city) {
    url = `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric&lang=pt_br`;
  } else if (lat && lng) {
    url = `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=pt_br`;
  }

  const response = await fetch(url!);
  const data = await response.json();

  return Response.json(data);

}