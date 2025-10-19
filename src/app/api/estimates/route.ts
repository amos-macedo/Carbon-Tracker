// src/app/api/estimates/route.ts
import { NextRequest } from 'next/server';

// Emissões realistas em kg CO₂ por km
const EMISSION_FACTORS: Record<string, number> = {
  // Sedans
  "toyota-corolla-2020": 0.120,
  "toyota-camry-2021": 0.135,
  "honda-civic-2020": 0.118,
  "honda-accord-2021": 0.140,
  
  // SUVs
  "toyota-rav4-2022": 0.150,
  "honda-crv-2022": 0.145,
  
  // Híbridos
  "toyota-prius-2021": 0.085,
  
  // Elétricos
  "tesla-model3-2022": 0.055, // Considerando geração de eletricidade
  "tesla-models-2021": 0.065
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { vehicleModelId, distance, distanceUnit = "km" } = body;

  const emissionFactor = EMISSION_FACTORS[vehicleModelId] || 0.150; // Padrão
  
  // Converter para km se necessário
  const distanceKm = distanceUnit === "mi" ? distance * 1.60934 : distance;
  
  const emissionKg = emissionFactor * distanceKm;

  return Response.json({
    success: true,
    data: {
      id: `estimate-${Date.now()}`,
      type: "estimate",
      attributes: {
        distance_value: distance,
        vehicle_model_id: vehicleModelId,
        distance_unit: distanceUnit,
        estimated_at: new Date().toISOString(),
        carbon_kg: Math.round(emissionKg * 100) / 100,
        carbon_g: Math.round(emissionKg * 1000),
        carbon_mt: Math.round(emissionKg * 0.001 * 100) / 100
      }
    },
    note: 'Cálculo mockado - dados realistas'
  });
}