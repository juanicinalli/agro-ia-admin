
"use client";

import { RecommendationList } from '@/components/recommendations/recommendation-list';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Lightbulb, BrainCircuit, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function RecommendationsPage() {
  const { recommendations, generateAIRecommendations, loadingAIRecommendations } = useApp();

  const aiRecommendations = recommendations.filter(r => r.source === 'ai');
  const manualRecommendations = recommendations.filter(r => r.source === 'manual');

  // Optionally, fetch AI recommendations on page load if none exist
  useEffect(() => {
    if (aiRecommendations.length === 0 && !loadingAIRecommendations) {
      // generateAIRecommendations(); // Uncomment to auto-fetch on load
    }
  }, [aiRecommendations.length, loadingAIRecommendations, generateAIRecommendations]);


  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Agronomic Recommendations</h1>
          <p className="text-muted-foreground">Insights to optimize your farming practices.</p>
        </div>
        <Button onClick={generateAIRecommendations} disabled={loadingAIRecommendations}>
          {loadingAIRecommendations ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" /> }
          {loadingAIRecommendations ? 'Generating...' : 'Get AI Recommendations'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecommendationList 
          recommendations={aiRecommendations} 
          title="AI-Powered Insights"
          icon={BrainCircuit}
        />
        <RecommendationList 
          recommendations={manualRecommendations} 
          title="Curated Advice"
          icon={Lightbulb}
        />
      </div>
    </div>
  );
}
