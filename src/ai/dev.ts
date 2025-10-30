import { config } from 'dotenv';
config();

import '@/ai/flows/session-summary.ts';
import '@/ai/flows/contextual-correction.ts';
import '@/ai/flows/translate-word-flow.ts';
import '@/ai/flows/translate-sentence-flow.ts';
