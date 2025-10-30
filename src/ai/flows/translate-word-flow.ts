'use server';

/**
 * @fileOverview A German to English word translator.
 *
 * - translateWord - A function that handles the German to English translation.
 * - TranslateWordInput - The input type for the translateWord function.
 * - TranslateWordOutput - The return type for the translateWord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const TranslateWordInputSchema = z.object({
  word: z.string().describe('The German word to translate.'),
});
export type TranslateWordInput = z.infer<typeof TranslateWordInputSchema>;

export const TranslateWordOutputSchema = z.object({
  translation: z.string().describe('The English translation of the word.'),
  pos: z.string().describe('The part of speech of the word (e.g., noun, verb, adjective).'),
});
export type TranslateWordOutput = z.infer<typeof TranslateWordOutputSchema>;

export async function translateWord(input: TranslateWordInput): Promise<TranslateWordOutput> {
  return translateWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateWordPrompt',
  input: {schema: TranslateWordInputSchema},
  output: {schema: TranslateWordOutputSchema},
  prompt: `You are a German to English dictionary. Provide the most common English translation and part of speech for the given German word.

  German Word: {{{word}}}

  Format your output as a JSON object with the following keys:
  - "translation": The English translation.
  - "pos": The part of speech (noun, verb, adjective, adverb, etc.).

  Example:
  German Word: "Haus"
  {
    "translation": "house",
    "pos": "noun"
  }
  `,
});

const translateWordFlow = ai.defineFlow(
  {
    name: 'translateWordFlow',
    inputSchema: TranslateWordInputSchema,
    outputSchema: TranslateWordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
