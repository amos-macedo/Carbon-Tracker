// src/app/api/vehicle-models/route.ts
import { NextRequest } from 'next/server';
import { MOCK_VEHICLE_MODELS } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const makeId = searchParams.get('makeId');

  if (!makeId) {
    return Response.json({ error: 'makeId é obrigatório' }, { status: 400 });
  }

  const models = MOCK_VEHICLE_MODELS[makeId] || [];
  
  return Response.json({
    success: true,
    data: models,
    note: 'Dados mockados'
  });
}



// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const makeId = searchParams.get('makeId');

//     if (!makeId) {
//       return NextResponse.json(
//         { error: 'Parâmetro makeId é obrigatório' },
//         { status: 400 }
//       );
//     }

//     const API_KEY = process.env.CARBON_API_KEY;
    
//     const response = await fetch(
//       `https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`,
//       {
//         headers: {
//           'Authorization': `Bearer ${API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`API error: ${response.status}`);
//     }

//     const data = await response.json();
    
//     return NextResponse.json({
//       success: true,
//       data: data
//     });

//   } catch (error) {
//     console.error('Error fetching vehicle models:', error);
    
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Erro ao buscar modelos de veículos' 
//       },
//       { status: 500 }
//     );
//   }
// }