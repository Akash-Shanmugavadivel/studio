"use server";

import {
  correctGerman as contextualCorrectionFlow,
  type ContextualCorrectionInput,
} from '@/ai/flows/contextual-correction';
import {
  generateSessionSummary as sessionSummaryFlow,
  type SessionSummaryInput,
} from '@/ai/flows/session-summary';

// Mock translation data
const dictionary: { [key: string]: { translation: string; pos: string } } = {
  'hallo': { translation: 'hello', pos: 'interjection' },
  'willkommen': { translation: 'welcome', pos: 'adjective' },
  'im': { translation: 'in the', pos: 'preposition' },
  'café': { translation: 'café', pos: 'noun' },
  'was': { translation: 'what', pos: 'pronoun' },
  'möchten': { translation: 'would like', pos: 'verb' },
  'sie': { translation: 'you', pos: 'pronoun' },
  'bestellen': { translation: 'to order', pos: 'verb' },
  'ich': { translation: 'I', pos: 'pronoun' },
  'kaffee': { translation: 'coffee', pos: 'noun' },
  'bitte': { translation: 'please', pos: 'adverb' },
  'einen': { translation: 'a/an', pos: 'article' },
  'guten': { translation: 'good', pos: 'adjective' },
  'tag': { translation: 'day', pos: 'noun' },
};

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
  
  if (dictionary[cleanedWord]) {
    return dictionary[cleanedWord];
  }

  // Fallback for words not in the mock dictionary
  return {
    translation: `[${cleanedWord}]`,
    pos: 'unknown',
  };
}
