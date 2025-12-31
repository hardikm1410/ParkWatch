import {genkit, stub} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [stub()],
  model: 'googleai/gemini-2.5-flash',
});
