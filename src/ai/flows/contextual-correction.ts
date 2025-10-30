'use server';

/**
 * @fileOverview A German language contextual correction AI agent.
 *
 * - correctGerman - A function that handles the German grammar and phrasing correction process, providing contextual corrections and explanations.
 * - ContextualCorrectionInput - The input type for the correctGerman function, including the user's message and the scenario.
 * - ContextualCorrectionOutput - The return type for the correctGerman function, including the corrected text, explanation, and a flag indicating whether a correction was made.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualCorrectionInputSchema = z.object({
  userMessage: z.string().describe('The user\u2019s message in German.'),
  scenario: z.string().describe('The scenario of the conversation (e.g., Café, Office).'),
});
export type ContextualCorrectionInput = z.infer<typeof ContextualCorrectionInputSchema>;

const ContextualCorrectionOutputSchema = z.object({
  correction: z.boolean().describe('Whether or not a correction was made.'),
  correctedText: z.string().describe('The corrected version of the user\u2019s message.'),
  explanationEn: z.string().describe('A short explanation of the correction in English.'),
});
export type ContextualCorrectionOutput = z.infer<typeof ContextualCorrectionOutputSchema>;

export async function correctGerman(input: ContextualCorrectionInput): Promise<ContextualCorrectionOutput> {
  return contextualCorrectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualCorrectionPrompt',
  input: {schema: ContextualCorrectionInputSchema},
  output: {schema: ContextualCorrectionOutputSchema},
  prompt: `You are an expert German language tutor, providing contextual corrections and explanations.

  The user is in the following scenario: {{{scenario}}}.

  Correct the user's message for grammar and phrasing, providing a short explanation in English. If no correction is needed, indicate that no correction was made.

  User Message: {{{userMessage}}}

  Format your output as a JSON object with the following keys:
  - correction (boolean): true if a correction was made, false otherwise.
  - correctedText (string): The corrected version of the user's message. If no correction was made, this should be the same as the user's message.
  - explanationEn (string): A short explanation of the correction in English. If no correction was made, this should be an empty string.

  Example 1:
  {
    "correction": true,
    "correctedText": "Ich m\u00f6chte einen Kaffee, bitte.",
    "explanationEn": "'m\u00f6chte' is more polite than 'will'."
  }

  Example 2:
  {
    "correction": false,
    "correctedText": "Hallo, wie geht es Ihnen?",
    "explanationEn": ""
  }
  `,
});

const contextualCorrectionFlow = ai.defineFlow(
  {
    name: 'contextualCorrectionFlow',
    inputSchema: ContextualCorrectionInputSchema,
    outputSchema: ContextualCorrectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
