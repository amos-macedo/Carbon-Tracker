import { VehicleModel } from "@/types/api";

// src/lib/mock-data.ts
export const MOCK_VEHICLE_MAKES = [
  {
    data: {
      id: "make-toyota",
      type: "vehicle_make",
      attributes: {
        name: "Toyota",
        number_of_models: 12,
      },
    },
  },
  {
    data: {
      id: "make-honda",
      type: "vehicle_make",
      attributes: {
        name: "Honda",
        number_of_models: 10,
      },
    },
  },
  {
    data: {
      id: "make-ford",
      type: "vehicle_make",
      attributes: {
        name: "Ford",
        number_of_models: 15,
      },
    },
  },
  {
    data: {
      id: "make-bmw",
      type: "vehicle_make",
      attributes: {
        name: "BMW",
        number_of_models: 8,
      },
    },
  },
  {
    data: {
      id: "make-tesla",
      type: "vehicle_make",
      attributes: {
        name: "Tesla",
        number_of_models: 6,
      },
    },
  },
];

export const MOCK_VEHICLE_MODELS: Record<string, VehicleModel[]> = {
  "make-toyota": [
    {
      data: {
        id: "toyota-corolla-2020",
        type: "vehicle_model",
        attributes: {
          name: "Corolla",
          year: 2020,
          vehicle_make: "Toyota",
        },
      },
    },
    {
      data: {
        id: "toyota-camry-2021",
        type: "vehicle_model",
        attributes: {
          name: "Camry",
          year: 2021,
          vehicle_make: "Toyota",
        },
      },
    },
    {
      data: {
        id: "toyota-rav4-2022",
        type: "vehicle_model",
        attributes: {
          name: "RAV4",
          year: 2022,
          vehicle_make: "Toyota",
        },
      },
    },
    {
      data: {
        id: "toyota-prius-2021",
        type: "vehicle_model",
        attributes: {
          name: "Prius",
          year: 2021,
          vehicle_make: "Toyota",
        },
      },
    },
  ],

  "make-honda": [
    {
      data: {
        id: "honda-civic-2020",
        type: "vehicle_model",
        attributes: {
          name: "Civic",
          year: 2020,
          vehicle_make: "Honda",
        },
      },
    },
    {
      data: {
        id: "honda-accord-2021",
        type: "vehicle_model",
        attributes: {
          name: "Accord",
          year: 2021,
          vehicle_make: "Honda",
        },
      },
    },
    {
      data: {
        id: "honda-crv-2022",
        type: "vehicle_model",
        attributes: {
          name: "CR-V",
          year: 2022,
          vehicle_make: "Honda",
        },
      },
    },
  ],

  "make-ford": [
    {
      data: {
        id: "ford-f150-2022",
        type: "vehicle_model",
        attributes: {
          name: "F-150",
          year: 2022,
          vehicle_make: "Ford",
        },
      },
    },
    {
      data: {
        id: "ford-mustang-2021",
        type: "vehicle_model",
        attributes: {
          name: "Mustang",
          year: 2021,
          vehicle_make: "Ford",
        },
      },
    },
    {
      data: {
        id: "ford-escape-2020",
        type: "vehicle_model",
        attributes: {
          name: "Escape",
          year: 2020,
          vehicle_make: "Ford",
        },
      },
    },
    {
      data: {
        id: "ford-bronco-2023",
        type: "vehicle_model",
        attributes: {
          name: "Bronco",
          year: 2023,
          vehicle_make: "Ford",
        },
      },
    },
  ],

  "make-bmw": [
    {
      data: {
        id: "bmw-3series-2021",
        type: "vehicle_model",
        attributes: {
          name: "3 Series",
          year: 2021,
          vehicle_make: "BMW",
        },
      },
    },
    {
      data: {
        id: "bmw-x5-2022",
        type: "vehicle_model",
        attributes: {
          name: "X5",
          year: 2022,
          vehicle_make: "BMW",
        },
      },
    },
    {
      data: {
        id: "bmw-i4-2023",
        type: "vehicle_model",
        attributes: {
          name: "i4",
          year: 2023,
          vehicle_make: "BMW",
        },
      },
    },
    {
      data: {
        id: "bmw-x3-2020",
        type: "vehicle_model",
        attributes: {
          name: "X3",
          year: 2020,
          vehicle_make: "BMW",
        },
      },
    },
  ],

  "make-tesla": [
    {
      data: {
        id: "tesla-model3-2022",
        type: "vehicle_model",
        attributes: {
          name: "Model 3",
          year: 2022,
          vehicle_make: "Tesla",
        },
      },
    },
    {
      data: {
        id: "tesla-models-2021",
        type: "vehicle_model",
        attributes: {
          name: "Model S",
          year: 2021,
          vehicle_make: "Tesla",
        },
      },
    },
    {
      data: {
        id: "tesla-modelx-2020",
        type: "vehicle_model",
        attributes: {
          name: "Model X",
          year: 2020,
          vehicle_make: "Tesla",
        },
      },
    },
    {
      data: {
        id: "tesla-modely-2023",
        type: "vehicle_model",
        attributes: {
          name: "Model Y",
          year: 2023,
          vehicle_make: "Tesla",
        },
      },
    },
  ],
};
