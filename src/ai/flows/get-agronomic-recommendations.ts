'use server';
/**
 * @fileOverview AI-driven agronomic recommendations based on field data and the current date.
 *
 * - getAgronomicRecommendations - A function that generates agronomic recommendations.
 * - AgronomicRecommendationsInput - The input type for the getAgronomicRecommendations function.
 * - AgronomicRecommendationsOutput - The return type for the getAgronomicRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgronomicRecommendationsInputSchema = z.object({
  fieldData: z.array(
    z.object({
      name: z.string().describe('The name of the field.'),
      crop: z.string().describe('The type of crop planted in the field.'),
      area: z.number().describe('The area of the field in acres.'),
      soilType: z.string().describe('The type of soil in the field.'),
      status: z.string().describe('The current status of the field.'),
    })
  ).describe('An array of field data objects.'),
  currentDate: z.string().describe('The current date in ISO format (YYYY-MM-DD).'),
});
export type AgronomicRecommendationsInput = z.infer<typeof AgronomicRecommendationsInputSchema>;

const AgronomicRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('A short title for the recommendation.'),
      description: z.string().describe('A detailed description of the recommendation.'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the recommendation.'),
    })
  ).describe('An array of agronomic recommendation objects.'),
});
export type AgronomicRecommendationsOutput = z.infer<typeof AgronomicRecommendationsOutputSchema>;

export async function getAgronomicRecommendations(
  input: AgronomicRecommendationsInput
): Promise<AgronomicRecommendationsOutput> {
  return getAgronomicRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agronomicRecommendationsPrompt',
  input: {schema: AgronomicRecommendationsInputSchema},
  output: {schema: AgronomicRecommendationsOutputSchema},
  prompt: `You are an expert agronomist providing recommendations to farmers based on their field data and the current date.

Current Date: {{{currentDate}}}

Field Data:
{{#each fieldData}}
  Field Name: {{{name}}}
  Crop: {{{crop}}}
  Area: {{{area}}} acres
  Soil Type: {{{soilType}}}
  Status: {{{status}}}
{{/each}}

Based on the current date and the field data provided, generate a list of actionable agronomic recommendations. Each recommendation should include a title, a detailed description, and a priority (High, Medium, or Low).

Consider the following:

*   Crop-specific needs based on the current date and growth stage.
*   Potential issues based on soil type and field status.
*   General best practices for agronomic management.

Be very concise.
`,
});

const getAgronomicRecommendationsFlow = ai.defineFlow(
  {
    name: 'getAgronomicRecommendationsFlow',
    inputSchema: AgronomicRecommendationsInputSchema,
    outputSchema: AgronomicRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
