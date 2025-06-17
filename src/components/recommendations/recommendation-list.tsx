
"use client";

import type { AgronomicRecommendationItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RecommendationListProps {
  recommendations: AgronomicRecommendationItem[];
  title: string;
  icon?: React.ElementType;
}

export function RecommendationList({ recommendations, title, icon: Icon }: RecommendationListProps) {
  const { t } = useTranslation();

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            {Icon && <Icon className="w-6 h-6 mr-2 text-primary" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('recommendations_page.no_recommendations_message')}</p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityBadgeVariant = (priority: 'High' | 'Medium' | 'Low'): "destructive" | "default" | "secondary" => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary'; 
      default: return 'secondary';
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          {Icon && <Icon className="w-6 h-6 mr-2 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recommendations.map((rec, index) => (
            <li key={index} className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold">{rec.title}</h4>
                <div className="flex items-center gap-2">
                  {rec.source === 'ai' && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <BrainCircuit className="w-3 h-3 mr-1" /> {t('calendar_page.activity_type_ai', 'AI')}
                    </Badge>
                  )}
                  <Badge variant={getPriorityBadgeVariant(rec.priority)}>{rec.priority}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

