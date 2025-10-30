'use server';

/**
 * @fileOverview A German to English sentence translator.
 *
 * - translateSentence - A function that handles the German to English translation for a sentence.
 * - TranslateSentenceInput - The input type for the translateSentence function.
 * - TranslateSentenceOutput - The return type for the translateSentence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateSentenceInputSchema = z.object({
  sentence: z.string().describe('The German sentence to translate.'),
});
export type TranslateSentenceInput = z.infer<typeof TranslateSentenceInputSchema>;

const TranslateSentenceOutputSchema = z.object({
  translation: z.string().describe('The English translation of the sentence.'),
});
export type TranslateSentenceOutput = z.infer<typeof TranslateSentenceOutputSchema>;

export async function translateSentence(input: TranslateSentenceInput): Promise<TranslateSentenceOutput> {
  return translateSentenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateSentencePrompt',
  input: {schema: TranslateSentenceInputSchema},
  output: {schema: TranslateSentenceOutputSchema},
  prompt: `You are a German to English translator. Provide the English translation for the given German sentence.

  German Sentence: {{{sentence}}}

  Format your output as a JSON object with the following key:
  - "translation": The English translation.

  Example:
  German Sentence: "Was möchten Sie bestellen?"
  {
    "translation": "What would you like to order?"
  }
  `,
});

const translateSentenceFlow = ai.defineFlow(
  {
    name: 'translateSentenceFlow',
    inputSchema: TranslateSentenceInputSchema,
    outputSchema: TranslateSentenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
