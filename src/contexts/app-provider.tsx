
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Field, Activity, AgronomicRecommendationItem, FieldDataForAI } from '@/lib/types';
import { MOCK_FIELDS, MOCK_ACTIVITIES, MOCK_MANUAL_RECOMMENDATIONS } from '@/lib/mock-data';
import { getAgronomicRecommendations as fetchAIRecommendations } from '@/ai/flows/get-agronomic-recommendations';
import { generateFieldActivityPlan as fetchAIPlan } from '@/ai/flows/generate-field-activity-plan';
import { useToast } from '@/hooks/use-toast';

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
  }, []);

  const getFieldById = useCallback((id: string) => fields.find(f => f.id === id), [fields]);

  const addField = useCallback((fieldData: Omit<Field, 'id' | 'activities' | 'imageUrl' | 'aiActivityPlan'>) => {
    const newField: Field = {
      ...fieldData,
      id: String(Date.now()), // Simple ID generation
      imageUrl: 'https://placehold.co/600x400.png',
      activities: [],
    };
    setFields(prev => [...prev, newField]);
    toast({ title: "Field Added", description: `${newField.name} has been successfully added.` });
  }, [toast]);

  const updateField = useCallback((id: string, fieldUpdate: Partial<Field>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...fieldUpdate } : f));
    const updatedField = fields.find(f => f.id === id);
    if (updatedField) {
       toast({ title: "Field Updated", description: `${updatedField.name} has been successfully updated.` });
    }
  }, [fields, toast]);

  const deleteField = useCallback((id: string) => {
    const fieldToDelete = fields.find(f => f.id === id);
    setFields(prev => prev.filter(f => f.id !== id));
    // Also remove activities associated with this field
    setActivities(prev => prev.filter(act => act.fieldId !== id));
    if (fieldToDelete) {
      toast({ title: "Field Deleted", description: `${fieldToDelete.name} has been successfully deleted.`, variant: "destructive" });
    }
  }, [fields, toast]);

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
    toast({ title: "Activity Added", description: `${newActivity.title} has been added to the calendar.` });
  }, [toast]);

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
      toast({ title: "AI Recommendations Generated", description: "New agronomic recommendations are available." });
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      toast({ title: "Error", description: "Could not generate AI recommendations.", variant: "destructive" });
    } finally {
      setLoadingAIRecommendations(false);
    }
  }, [fields, toast]);

  const generateAIFieldPlan = useCallback(async (fieldId: string) => {
    const field = getFieldById(fieldId);
    if (!field) {
      toast({ title: "Error", description: "Field not found.", variant: "destructive" });
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
      toast({ title: "AI Activity Plan Generated", description: `A new plan for ${field.name} is available.` });
    } catch (error) {
      console.error("Error generating AI field plan:", error);
      toast({ title: "Error", description: "Could not generate AI activity plan.", variant: "destructive" });
    } finally {
      setLoadingAIPlan(false);
    }
  }, [getFieldById, updateField, toast]);


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
