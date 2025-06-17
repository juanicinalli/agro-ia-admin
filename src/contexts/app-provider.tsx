
"use client";

import '../i18n'; // Import i18n configuration
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Field, Activity, AgronomicRecommendationItem, FieldDataForAI } from '@/lib/types';
import { MOCK_FIELDS, MOCK_ACTIVITIES, MOCK_MANUAL_RECOMMENDATIONS } from '@/lib/mock-data';
import { getAgronomicRecommendations as fetchAIRecommendations } from '@/ai/flows/get-agronomic-recommendations';
import { generateFieldActivityPlan as fetchAIPlan } from '@/ai/flows/generate-field-activity-plan';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  fields: Field[];
  activities: Activity[];
  recommendations: AgronomicRecommendationItem[];
  getFieldById: (id: string) => Field | undefined;
  addField: (field: Omit<Field, 'id' | 'activities' | 'imageUrl' | 'aiActivityPlan'>) => void;
  updateField: (id: string, fieldUpdate: Partial<Field>) => void;
  deleteField: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  generateAIRecommendations: () => Promise<void>;
  generateAIFieldPlan: (fieldId: string) => Promise<void>;
  loadingAIRecommendations: boolean;
  loadingAIPlan: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'agrovision_auth';

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fields, setFields] = useState<Field[]>(MOCK_FIELDS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [recommendations, setRecommendations] = useState<AgronomicRecommendationItem[]>(MOCK_MANUAL_RECOMMENDATIONS);
  const [loadingAIRecommendations, setLoadingAIRecommendations] = useState(false);
  const [loadingAIPlan, setLoadingAIPlan] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    // Optionally, redirect to login page or refresh to apply language changes if any were pending
    window.location.href = '/login'; 
  }, []);

  const getFieldById = useCallback((id: string) => fields.find(f => f.id === id), [fields]);

  const addField = useCallback((fieldData: Omit<Field, 'id' | 'activities' | 'imageUrl' | 'aiActivityPlan'>) => {
    const newField: Field = {
      ...fieldData,
      id: String(Date.now()), 
      imageUrl: 'https://placehold.co/600x400.png',
      activities: [],
    };
    setFields(prev => [...prev, newField]);
    toast({ 
      title: t("toast.field_added.title"), 
      description: t("toast.field_added.description", { fieldName: newField.name }) 
    });
  }, [toast, t]);

  const updateField = useCallback((id: string, fieldUpdate: Partial<Field>) => {
    let updatedFieldName = '';
    setFields(prev => prev.map(f => {
      if (f.id === id) {
        updatedFieldName = fieldUpdate.name || f.name;
        return { ...f, ...fieldUpdate };
      }
      return f;
    }));
    if (updatedFieldName) {
       toast({ 
         title: t("toast.field_updated.title"), 
         description: t("toast.field_updated.description", { fieldName: updatedFieldName }) 
       });
    }
  }, [toast, t]);

  const deleteField = useCallback((id: string) => {
    const fieldToDelete = fields.find(f => f.id === id);
    setFields(prev => prev.filter(f => f.id !== id));
    setActivities(prev => prev.filter(act => act.fieldId !== id));
    if (fieldToDelete) {
      toast({ 
        title: t("toast.field_deleted.title"), 
        description: t("toast.field_deleted.description", { fieldName: fieldToDelete.name }), 
        variant: "destructive" 
      });
    }
  }, [fields, toast, t]);

  const addActivity = useCallback((activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: String(Date.now()),
    };
    setActivities(prev => [...prev, newActivity]);
    if (activityData.fieldId) {
      setFields(prevFields => prevFields.map(f => 
        f.id === activityData.fieldId 
        ? { ...f, activities: [...(f.activities || []), newActivity] } 
        : f
      ));
    }
    toast({ 
      title: t("toast.activity_added.title"), 
      description: t("toast.activity_added.description", { activityTitle: newActivity.title }) 
    });
  }, [toast, t]);

  const generateAIRecommendations = useCallback(async () => {
    setLoadingAIRecommendations(true);
    try {
      const fieldDataForAI: FieldDataForAI[] = fields.map(f => ({
        name: f.name,
        crop: f.cropType,
        area: f.area,
        soilType: f.soilType,
        status: f.status,
      }));
      
      const currentDate = new Date().toISOString().split('T')[0];
      const aiResult = await fetchAIRecommendations({ fieldData: fieldDataForAI, currentDate });
      
      const newAIRecommendations: AgronomicRecommendationItem[] = aiResult.recommendations.map(rec => ({
        ...rec,
        source: 'ai',
      }));
      
      setRecommendations(prev => [...MOCK_MANUAL_RECOMMENDATIONS, ...newAIRecommendations]);
      toast({ 
        title: t("toast.ai_recommendations_generated.title"), 
        description: t("toast.ai_recommendations_generated.description") 
      });
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      toast({ 
        title: t("toast.error.title"), 
        description: t("toast.error.generating_ai_recommendations"), 
        variant: "destructive" 
      });
    } finally {
      setLoadingAIRecommendations(false);
    }
  }, [fields, toast, t]);

  const generateAIFieldPlan = useCallback(async (fieldId: string) => {
    const field = getFieldById(fieldId);
    if (!field) {
      toast({ 
        title: t("toast.error.title"), 
        description: t("toast.error.field_not_found"), 
        variant: "destructive" 
      });
      return;
    }
    setLoadingAIPlan(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const input = {
        fieldName: field.name,
        cropType: field.cropType,
        area: field.area,
        soilType: field.soilType,
        status: field.status,
        currentDate: currentDate,
      };
      const result = await fetchAIPlan(input);
      updateField(fieldId, { aiActivityPlan: result.plan });
      toast({ 
        title: t("toast.ai_plan_generated.title"), 
        description: t("toast.ai_plan_generated.description", { fieldName: field.name }) 
      });
    } catch (error) {
      console.error("Error generating AI field plan:", error);
      toast({ 
        title: t("toast.error.title"), 
        description: t("toast.error.generating_ai_plan"), 
        variant: "destructive" 
      });
    } finally {
      setLoadingAIPlan(false);
    }
  }, [getFieldById, updateField, toast, t]);


  return (
    <AppContext.Provider value={{
      isAuthenticated, login, logout,
      fields, activities, recommendations,
      getFieldById, addField, updateField, deleteField,
      addActivity, generateAIRecommendations, generateAIFieldPlan,
      loadingAIRecommendations, loadingAIPlan
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
