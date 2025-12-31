'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending optimal parking fees based on predicted occupancy.
 *
 * recommendOptimalFees - A function that takes predicted occupancy data and recommends optimal parking fees.
 * RecommendOptimalFeesInput - The input type for the recommendOptimalFees function.
 * RecommendOptimalFeesOutput - The return type for the recommendOptimalFees function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendOptimalFeesInputSchema = z.object({
  predictedOccupancy: z
    .number()
    .describe(
      'The predicted occupancy rate as a decimal (e.g., 0.75 for 75% occupancy).'
    ),
  currentFee: z.number().describe('The current parking fee.'),
  parkingLocation: z.string().describe('The name of the parking location.'),
});
export type RecommendOptimalFeesInput = z.infer<typeof RecommendOptimalFeesInputSchema>;

const RecommendOptimalFeesOutputSchema = z.object({
  recommendedFee: z
    .number()
    .describe('The recommended parking fee based on predicted occupancy.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the recommended fee adjustment, considering maximizing revenue and customer satisfaction.'
    ),
});
export type RecommendOptimalFeesOutput = z.infer<typeof RecommendOptimalFeesOutputSchema>;

export async function recommendOptimalFees(
  input: RecommendOptimalFeesInput
): Promise<RecommendOptimalFeesOutput> {
  return recommendOptimalFeesFlow(input);
}

const recommendOptimalFeesPrompt = ai.definePrompt({
  name: 'recommendOptimalFeesPrompt',
  input: {schema: RecommendOptimalFeesInputSchema},
  output: {schema: RecommendOptimalFeesOutputSchema},
  prompt: `You are an expert in optimizing parking fees to maximize revenue while ensuring customer satisfaction. Analyze the predicted occupancy rate and the current fee, then recommend an optimal fee and explain your reasoning.

Parking Location: {{parkingLocation}}
Current Fee: {{currentFee}}
Predicted Occupancy: {{predictedOccupancy}}

Consider the following:
- Higher occupancy rates may justify higher fees.
- Lower occupancy rates may require lower fees to attract more customers.
- The goal is to find a balance that maximizes revenue without discouraging customers.

Respond with a recommended fee and a concise explanation of your reasoning.

Recommended Fee: {{recommendedFee}}
Reasoning: {{reasoning}}`,
});

const recommendOptimalFeesFlow = ai.defineFlow(
  {
    name: 'recommendOptimalFeesFlow',
    inputSchema: RecommendOptimalFeesInputSchema,
    outputSchema: RecommendOptimalFeesOutputSchema,
  },
  async input => {
    const {output} = await recommendOptimalFeesPrompt(input);
    return output!;
  }
);
