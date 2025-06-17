import type { Field, Activity, AgronomicRecommendationItem } from './types';

export const MOCK_FIELDS: Field[] = [
  {
    id: '1',
    name: 'North Paddock',
    cropType: 'Corn',
    area: 120,
    soilType: 'Loamy Sand',
    status: 'Growing',
    imageUrl: 'https://placehold.co/600x400.png',
    activities: [
      { id: 'act1', fieldId: '1', title: 'Planting Corn', description: 'Completed planting of corn seeds.', date: '2024-05-15', type: 'manual' },
      { id: 'act2', fieldId: '1', title: 'Fertilization Round 1', description: 'Applied initial fertilizer.', date: '2024-05-20', type: 'manual' },
    ],
  },
  {
    id: '2',
    name: 'Sunset Valley',
    cropType: 'Soybeans',
    area: 250,
    soilType: 'Clay Loam',
    status: 'Planted',
    imageUrl: 'https://placehold.co/600x400.png',
    activities: [
       { id: 'act3', fieldId: '2', title: 'Planting Soybeans', description: 'Completed planting of soybean seeds.', date: '2024-06-01', type: 'manual' },
    ],
  },
  {
    id: '3',
    name: 'Green Acres',
    cropType: 'Wheat',
    area: 80,
    soilType: 'Silty Clay',
    status: 'Harvested',
    imageUrl: 'https://placehold.co/600x400.png',
    activities: [],
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'gen_act1', title: 'General Farm Maintenance', description: 'Check all equipment and storage facilities.', date: '2024-07-10', type: 'manual' },
  { id: 'gen_act2', title: 'Soil Sampling - Central Fields', description: 'Collect soil samples for analysis.', date: '2024-07-18', type: 'manual' },
  ...MOCK_FIELDS.flatMap(field => field.activities || [])
];

export const MOCK_MANUAL_RECOMMENDATIONS: AgronomicRecommendationItem[] = [
  {
    title: 'Crop Rotation Planning',
    description: 'Review and plan crop rotation for next season to improve soil health and reduce pest risks.',
    priority: 'High',
    source: 'manual',
  },
  {
    title: 'Water Management System Check',
    description: 'Inspect irrigation systems for leaks and efficiency before the peak summer heat.',
    priority: 'Medium',
    source: 'manual',
  },
  {
    title: 'Equipment Maintenance Schedule',
    description: 'Ensure all farm machinery is serviced and ready for upcoming operations.',
    priority: 'Low',
    source: 'manual',
  },
];
