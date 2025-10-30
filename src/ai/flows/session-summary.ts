'use server';
/**
 * @fileOverview Generates a session summary with key corrections, saved vocabulary, and practice suggestions.
 *
 * - generateSessionSummary - A function that generates the session summary.
 * - SessionSummaryInput - The input type for the generateSessionSummary function.
 * - SessionSummaryOutput - The return type for the generateSessionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SessionSummaryInputSchema = z.object({
  conversationLog: z.string().describe('The complete conversation log between the user and the AI tutor.'),
  savedVocabulary: z.array(z.string()).describe('An array of vocabulary words saved by the user during the session.'),
  corrections: z.array(z.string()).describe('An array of corrections made by the AI tutor during the session.'),
});
export type SessionSummaryInput = z.infer<typeof SessionSummaryInputSchema>;

const SessionSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the session, including key corrections, saved vocabulary, and practice suggestions.'),
});
export type SessionSummaryOutput = z.infer<typeof SessionSummaryOutputSchema>;

export async function generateSessionSummary(input: SessionSummaryInput): Promise<SessionSummaryOutput> {
  return sessionSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sessionSummaryPrompt',
  input: {schema: SessionSummaryInputSchema},
  output: {schema: SessionSummaryOutputSchema},
  prompt: `You are an AI language tutor summarizing a German language learning session.

  Based on the conversation log, saved vocabulary, and corrections, provide a concise and helpful summary of the session.
  Include key corrections, saved vocabulary, and practice suggestions tailored to the user's progress.

  Conversation Log: {{{conversationLog}}}
  Saved Vocabulary: {{#each savedVocabulary}}{{{this}}}, {{/each}}
  Corrections: {{#each corrections}}{{{this}}}, {{/each}}
  `,
});

const sessionSummaryFlow = ai.defineFlow(
  {
    name: 'sessionSummaryFlow',
    inputSchema: SessionSummaryInputSchema,
    outputSchema: SessionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
