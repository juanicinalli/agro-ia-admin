'use server';

/**
 * @fileOverview Generates an agronomic activity plan for a specific field using AI.
 *
 * - generateFieldActivityPlan - A function that generates the plan.
 * - GenerateFieldActivityPlanInput - The input type for the generateFieldActivityPlan function.
 * - GenerateFieldActivityPlanOutput - The return type for the generateFieldActivityPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFieldActivityPlanInputSchema = z.object({
  fieldName: z.string().describe('The name of the field.'),
  cropType: z.string().describe('The type of crop planted in the field.'),
  area: z.number().describe('The area of the field in acres.'),
  soilType: z.string().describe('The type of soil in the field.'),
  status: z.string().describe('The current status of the field (e.g., planted, growing, harvested).'),
  currentDate: z.string().describe('The current date.'),
});

export type GenerateFieldActivityPlanInput = z.infer<typeof GenerateFieldActivityPlanInputSchema>;

const GenerateFieldActivityPlanOutputSchema = z.object({
  plan: z.string().describe('A detailed agronomic plan with actionable steps for the field.'),
});

export type GenerateFieldActivityPlanOutput = z.infer<typeof GenerateFieldActivityPlanOutputSchema>;

export async function generateFieldActivityPlan(input: GenerateFieldActivityPlanInput): Promise<GenerateFieldActivityPlanOutput> {
  return generateFieldActivityPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFieldActivityPlanPrompt',
  input: {schema: GenerateFieldActivityPlanInputSchema},
  output: {schema: GenerateFieldActivityPlanOutputSchema},
  prompt: `You are an expert agronomy advisor. Generate an agronomic plan with actionable steps for the specified field, taking into account the current date and all available field data. Base your recommendations on best practices for the specified crop and soil type. Be concise.

Field Name: {{{fieldName}}}
Crop Type: {{{cropType}}}
Area: {{{area}}} acres
Soil Type: {{{soilType}}}
Status: {{{status}}}
Current Date: {{{currentDate}}}`,
});

const generateFieldActivityPlanFlow = ai.defineFlow(
  {
    name: 'generateFieldActivityPlanFlow',
    inputSchema: GenerateFieldActivityPlanInputSchema,
    outputSchema: GenerateFieldActivityPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
