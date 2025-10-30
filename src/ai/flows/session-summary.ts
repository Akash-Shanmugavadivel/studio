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
  performanceOverview: z.string().describe("A brief, encouraging overview of the user's performance during the session."),
  keyVocabulary: z.array(z.string()).describe('A list of 3-5 key vocabulary words or phrases from the session that the user should remember.'),
  grammarPoints: z.array(z.object({
    point: z.string().describe('The specific grammar or phrasing topic the user struggled with (e.g., "Noun Genders", "Polite vs. Formal verbs").'),
    explanation: z.string().describe('A brief, simple explanation of the grammar point and how to improve.'),
  })).describe('A list of 1-3 grammar or phrasing points the user should review, based on the corrections made.'),
  practiceSuggestions: z.array(z.string()).describe('A list of 2-3 concrete, actionable practice suggestions for the user to work on next.'),
});
export type SessionSummaryOutput = z.infer<typeof SessionSummaryOutputSchema>;

export async function generateSessionSummary(input: SessionSummaryInput): Promise<SessionSummaryOutput> {
  return sessionSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sessionSummaryPrompt',
  input: {schema: SessionSummaryInputSchema},
  output: {schema: SessionSummaryOutputSchema},
  prompt: `You are an AI language tutor summarizing a German language learning session. Your tone should be encouraging and supportive.

  Based on the conversation log, saved vocabulary, and corrections, generate a structured session summary.

  1.  **Performance Overview**: Write a brief, encouraging overview of the user's performance.
  2.  **Key Vocabulary**: Identify 3-5 important vocabulary words or phrases from the session. Include both saved vocabulary and other relevant terms from the conversation.
  3.  **Grammar Points**: Analyze the corrections made. Identify 1-3 recurring grammar or phrasing issues. For each, provide a simple name for the concept (e.g., "Noun Genders") and a very short, clear explanation.
  4.  **Practice Suggestions**: Based on the user's performance, provide 2-3 concrete and actionable practice suggestions.

  Conversation Log: {{{conversationLog}}}
  Saved Vocabulary: {{#each savedVocabulary}}"{{{this}}}"{{#unless @last}}, {{/unless}}{{/each}}
  Corrections Made: {{#each corrections}}"{{{this}}}"{{#unless @last}}, {{/unless}}{{/each}}
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
