// src/lib/carbon-api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const carbonAPI = {
  // Buscar todas as marcas
  async getVehicleMakes() {
    const response = await fetch(`${API_BASE_URL}/api/vehicle-makes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle makes');
    }
    
    return response.json();
  },

  // Buscar modelos por marca
// Buscar modelos por marca
async getVehicleModels(makeId?: string) {
  if (!makeId) {
    throw new Error('makeId é obrigatório');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/vehicle-models?makeId=${makeId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle models');
  }
  
  return response.json();
},

async createEstimate(vehicleModelId?: string, distance?: number, distanceUnit?: string) {
  if (!vehicleModelId || !distance ) {
    throw new Error('vehicleModelId and distance are required');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/estimates?vehicleModelId=${vehicleModelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vehicleModelId, distance, distanceUnit }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch estimates');
  }
  
  return response.json();
},

};