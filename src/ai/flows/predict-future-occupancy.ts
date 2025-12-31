'use server';
/**
 * @fileOverview Predicts future parking occupancy rates based on historical data.
 *
 * - predictFutureOccupancy - A function that predicts future parking occupancy.
 * - PredictFutureOccupancyInput - The input type for the predictFutureOccupancy function.
 * - PredictFutureOccupancyOutput - The return type for the predictFutureOccupancy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureOccupancyInputSchema = z.object({
  parkingLocation: z.string().describe('The name or ID of the parking location.'),
  dateTime: z.string().describe('The date and time for which to predict occupancy (ISO format).'),
});
export type PredictFutureOccupancyInput = z.infer<typeof PredictFutureOccupancyInputSchema>;

const PredictFutureOccupancyOutputSchema = z.object({
  predictedOccupancyRate: z
    .number()
    .describe('The predicted occupancy rate as a percentage (0-100).'),
  recommendedParkingFee: z
    .number()
    .describe('The recommended parking fee for the specified time.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the predicted occupancy rate and recommended fee.'),
});
export type PredictFutureOccupancyOutput = z.infer<typeof PredictFutureOccupancyOutputSchema>;

export async function predictFutureOccupancy(
  input: PredictFutureOccupancyInput
): Promise<PredictFutureOccupancyOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }
  return predictFutureOccupancyFlow(input);
}

const predictFutureOccupancyPrompt = ai.definePrompt({
  name: 'predictFutureOccupancyPrompt',
  input: {schema: PredictFutureOccupancyInputSchema},
  output: {schema: PredictFutureOccupancyOutputSchema},
  prompt: `You are an expert in predicting parking occupancy rates and optimizing parking fees.

  Based on historical data and the current date and time, predict the occupancy rate for the specified parking location and recommend an optimal parking fee.

  Parking Location: {{{parkingLocation}}}
  Date and Time: {{{dateTime}}}

  Consider factors such as day of the week, time of day, and any known events that might affect parking demand.

  Provide a predicted occupancy rate as a percentage (0-100) and a recommended parking fee in USD.
  Also, explain your reasoning behind your prediction and recommendation.

  Format your response according to the following schema:
  {{json schema=PredictFutureOccupancyOutputSchema}}
  `,
});

const predictFutureOccupancyFlow = ai.defineFlow(
  {
    name: 'predictFutureOccupancyFlow',
    inputSchema: PredictFutureOccupancyInputSchema,
    outputSchema: PredictFutureOccupancyOutputSchema,
  },
  async input => {
    const {output} = await predictFutureOccupancyPrompt(input);
    return output!;
  }
);
