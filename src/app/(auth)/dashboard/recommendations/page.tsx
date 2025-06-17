
"use client";

import { RecommendationList } from '@/components/recommendations/recommendation-list';
import { useApp } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Lightbulb, BrainCircuit, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function RecommendationsPage() {
  const { recommendations, generateAIRecommendations, loadingAIRecommendations } = useApp();
  const { t } = useTranslation();

  const aiRecommendations = recommendations.filter(r => r.source === 'ai');
  const manualRecommendations = recommendations.filter(r => r.source === 'manual');

  useEffect(() => {
    if (aiRecommendations.length === 0 && !loadingAIRecommendations) {
      // generateAIRecommendations(); // Uncomment to auto-fetch on load
    }
  }, [aiRecommendations.length, loadingAIRecommendations, generateAIRecommendations]);


  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold">{t('recommendations_page.title')}</h1>
          <p className="text-muted-foreground">{t('recommendations_page.description')}</p>
        </div>
        <Button onClick={generateAIRecommendations} disabled={loadingAIRecommendations}>
          {loadingAIRecommendations ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" /> }
          {loadingAIRecommendations ? t('recommendations_page.generating_ai_button') : t('recommendations_page.get_ai_button')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecommendationList 
          recommendations={aiRecommendations} 
          title={t('recommendations_page.ai_powered_title')}
          icon={BrainCircuit}
        />
        <RecommendationList 
          recommendations={manualRecommendations} 
          title={t('recommendations_page.curated_advice_title')}
          icon={Lightbulb}
        />
      </div>
    </div>
  );
}

