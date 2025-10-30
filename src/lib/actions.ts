"use server";

import {
  correctGerman as contextualCorrectionFlow,
  type ContextualCorrectionInput,
} from '@/ai/flows/contextual-correction';
import {
  generateSessionSummary as sessionSummaryFlow,
  type SessionSummaryInput,
} from '@/ai/flows/session-summary';
import {
    translateWord as translateWordFlow,
    type TranslateWordInput,
} from '@/ai/flows/translate-word-flow';


export async function correctGerman(input: ContextualCorrectionInput) {
  // Add a delay to simulate network latency for a better UX
  await new Promise(resolve => setTimeout(resolve, 500));
  return contextualCorrectionFlow(input);
}

export async function generateSessionSummary(input: SessionSummaryInput) {
  // Add a delay to simulate network latency for a better UX
  await new Promise(resolve => setTimeout(resolve, 1000));
  return sessionSummaryFlow(input);
}

export async function translateWord(word: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const cleanedWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    
    return translateWordFlow({ word: cleanedWord });
}
