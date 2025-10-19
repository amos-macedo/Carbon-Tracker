// src/app/api/vehicle-makes/route.ts
import { NextResponse } from 'next/server';

// GET /api/vehicle-makes

// src/app/api/vehicle-makes/route.ts
import { MOCK_VEHICLE_MAKES } from '@/lib/mock-data';

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_VEHICLE_MAKES,
    note: 'Dados mockados - API Carbon Interface temporariamente indisponível'
  });
}

// export async function GET() {

//   console.log('API Key:', process.env.CARBON_API_KEY);
//   try {
//     const API_KEY = process.env.CARBON_API_KEY || "05g7ORm5kgL7LvyQ5aqg"

//     console.log('API Key:', API_KEY);
    
//     if (!API_KEY) {
//       return NextResponse.json(
//         { error: 'API key não configurada' },
//         { status: 500 }
//       );
//     }

//     const response = await fetch('https://www.carboninterface.com/api/v1/vehicle_makes', {
//       headers: {
//         'Authorization': `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`API error: ${response.status}`);
//     }

//     const data = await response.json();
    
//     // Retorna os dados formatados
//     return NextResponse.json({
//       success: true,
//       data: data
//     });

//   } catch (error) {
//     console.error('Error fetching vehicle makes:', error);
    
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Erro ao buscar marcas de veículos' 
//       },
//       { status: 500 }
//     );
//   }
// }