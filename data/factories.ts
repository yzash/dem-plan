export type FactoryType = "owned" | "contract";

export type Factory = {
  id: string;
  name: string;
  country: "IN" | "BD" | "VN" | "TR";
  type: FactoryType;
  capacityUnitsPerWeek: number;
  currentUtilization: number; // 0–1
  leadTimeDays: number;
  costIndex: number; // 0.7–1.2
  sustainabilityScore: number; // 0–100
  categories: string[];
};

export const factories: Factory[] = [
  {
    id: "FAC-IN-01",
    name: "Tirupur Apparel Works",
    country: "IN",
    type: "owned",
    capacityUnitsPerWeek: 42000,
    currentUtilization: 0.74,
    leadTimeDays: 18,
    costIndex: 0.92,
    sustainabilityScore: 78,
    categories: ["Tops", "Activewear", "Knitwear"],
  },
  {
    id: "FAC-IN-02",
    name: "Bangalore Knit House",
    country: "IN",
    type: "contract",
    capacityUnitsPerWeek: 28000,
    currentUtilization: 0.86,
    leadTimeDays: 22,
    costIndex: 0.95,
    sustainabilityScore: 65,
    categories: ["Knitwear", "Tops"],
  },
  {
    id: "FAC-IN-03",
    name: "Delhi Outerwear Co.",
    country: "IN",
    type: "contract",
    capacityUnitsPerWeek: 18000,
    currentUtilization: 0.62,
    leadTimeDays: 26,
    costIndex: 1.05,
    sustainabilityScore: 58,
    categories: ["Outerwear", "Bottoms"],
  },
  {
    id: "FAC-BD-01",
    name: "Dhaka Garment Lines",
    country: "BD",
    type: "contract",
    capacityUnitsPerWeek: 65000,
    currentUtilization: 0.91,
    leadTimeDays: 32,
    costIndex: 0.78,
    sustainabilityScore: 52,
    categories: ["Tops", "Bottoms", "Dresses"],
  },
  {
    id: "FAC-BD-02",
    name: "Chittagong Denim Mill",
    country: "BD",
    type: "owned",
    capacityUnitsPerWeek: 38000,
    currentUtilization: 0.7,
    leadTimeDays: 30,
    costIndex: 0.82,
    sustainabilityScore: 70,
    categories: ["Bottoms"],
  },
  {
    id: "FAC-VN-01",
    name: "Ho Chi Minh Active Co.",
    country: "VN",
    type: "owned",
    capacityUnitsPerWeek: 32000,
    currentUtilization: 0.55,
    leadTimeDays: 24,
    costIndex: 1.0,
    sustainabilityScore: 84,
    categories: ["Activewear", "Tops"],
  },
  {
    id: "FAC-VN-02",
    name: "Hanoi Silhouette Atelier",
    country: "VN",
    type: "contract",
    capacityUnitsPerWeek: 14000,
    currentUtilization: 0.8,
    leadTimeDays: 28,
    costIndex: 1.12,
    sustainabilityScore: 88,
    categories: ["Dresses", "Outerwear"],
  },
  {
    id: "FAC-TR-01",
    name: "Istanbul Fast Studio",
    country: "TR",
    type: "owned",
    capacityUnitsPerWeek: 22000,
    currentUtilization: 0.48,
    leadTimeDays: 12,
    costIndex: 1.18,
    sustainabilityScore: 92,
    categories: ["Outerwear", "Knitwear", "Dresses"],
  },
  {
    id: "FAC-TR-02",
    name: "Izmir Trend Mill",
    country: "TR",
    type: "contract",
    capacityUnitsPerWeek: 16000,
    currentUtilization: 0.66,
    leadTimeDays: 14,
    costIndex: 1.08,
    sustainabilityScore: 80,
    categories: ["Tops", "Dresses", "Bottoms"],
  },
  {
    id: "FAC-IN-04",
    name: "Jaipur Print Atelier",
    country: "IN",
    type: "contract",
    capacityUnitsPerWeek: 9000,
    currentUtilization: 0.4,
    leadTimeDays: 20,
    costIndex: 0.97,
    sustainabilityScore: 74,
    categories: ["Dresses", "Tops"],
  },
];

export function factoryById(id: string): Factory | undefined {
  return factories.find((f) => f.id === id);
}
