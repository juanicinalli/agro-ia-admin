export interface Field {
  id: string;
  name: string;
  cropType: string;
  area: number; // in acres
  soilType: string;
  status: string; // e.g., 'Planted', 'Growing', 'Harvesting', 'Fallow'
  imageUrl?: string; 
  activities?: Activity[]; 
  aiActivityPlan?: string; // To store the AI generated plan string
}

export interface Activity {
  id: string;
  fieldId?: string; // Optional: To link back to a specific field
  title: string;
  description: string;
  date: string; // ISO Date string YYYY-MM-DD
  type: 'manual' | 'ai-derived'; // To distinguish source
}

export interface AgronomicRecommendationItem {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  source: 'ai' | 'manual'; 
}

// For AI input when fetching recommendations
export interface FieldDataForAI {
  name: string;
  crop: string;
  area: number;
  soilType: string;
  status: string;
}
