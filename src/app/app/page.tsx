"use client";

import { useState } from 'react';
import type { Scenario, SubScenario } from '@/lib/scenarios';
import { scenarios } from '@/lib/scenarios';
import ScenarioList from '@/components/lingoflow/ScenarioList';
import ChatPanel from '@/components/lingoflow/ChatPanel';
import SummaryPanel from '@/components/lingoflow/SummaryPanel';
import { generateSessionSummary } from '@/lib/actions';

export type SessionState = 'idle' | 'active' | 'ended';
export type Message = {
  role: 'user' | 'assistant';
  text: string;
  correction?: {
    isCorrected: boolean;
    correctedText: string;
    explanation: string;
  };
};

export type Summary = {
  summary: string;
};

export default function AppPage() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [currentScenario, setCurrentScenario] = useState<SubScenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [savedVocabulary, setSavedVocabulary] = useState<string[]>([]);
  const [corrections, setCorrections] = useState<string[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const startSession = (scenario: SubScenario) => {
    setCurrentScenario(scenario);
    setMessages([
      {
        role: 'assistant',
        text: scenario.welcomeMessage,
      },
    ]);
    setSessionState('active');
    setSavedVocabulary([]);
    setCorrections([]);
    setSummary(null);
  };

  const endSession = async () => {
    setSessionState('ended');
    setIsSummaryLoading(true);
    const conversationLog = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    try {
      const result = await generateSessionSummary({ conversationLog, savedVocabulary, corrections });
      setSummary(result);
    } catch (error) {
      console.error("Failed to generate session summary:", error);
      setSummary({ summary: "We couldn't generate a summary for this session. Please try again." });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const resetSession = () => {
    setSessionState('idle');
    setCurrentScenario(null);
    setMessages([]);
  };
  
  const addCorrection = (explanation: string) => {
    setCorrections(prev => [...prev, explanation]);
  }

  const addSavedVocabulary = (word: string) => {
    setSavedVocabulary(prev => {
        if (!prev.includes(word)) {
            return [...prev, word];
        }
        return prev;
    });
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr_380px] h-screen w-full">
      <div className="hidden md:flex md:flex-col bg-muted/50 border-r">
        <ScenarioList scenarios={scenarios} onScenarioSelect={startSession} activeScenario={currentScenario} />
      </div>

      <div className="flex flex-col h-screen bg-background">
        {sessionState === 'idle' && (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4"><path d="M17 6.091V4.5a2.5 2.5 0 0 0-5 0v1.582A6.002 6.002 0 0 0 6 12c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.802-.79-3.412-2-4.518Z"/><path d="M12 18a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2a2 2 0 0 0-2-2Z"/><path d="m4.13 4.13 1.83 1.83"/><path d="M18.04 4.13l-1.83 1.83"/></svg>
            <h2 className="text-2xl font-bold">Welcome to LingoFlow AI</h2>
            <p className="text-muted-foreground mt-2">Select a scenario to start your German conversation practice.</p>
            <div className="md:hidden mt-4 w-full max-w-sm">
              <ScenarioList scenarios={scenarios} onScenarioSelect={startSession} activeScenario={currentScenario} />
            </div>
          </div>
        )}
        {sessionState !== 'idle' && currentScenario && (
          <ChatPanel
            scenario={currentScenario}
            messages={messages}
            setMessages={setMessages}
            onEndSession={endSession}
            sessionState={sessionState}
            addCorrection={addCorrection}
            addSavedVocabulary={addSavedVocabulary}
          />
        )}
      </div>

      <div className="hidden lg:flex lg:flex-col bg-muted/50 border-l">
        <SummaryPanel 
          summary={summary}
          isLoading={isSummaryLoading}
          savedVocabulary={savedVocabulary}
          onReset={resetSession}
          sessionEnded={sessionState === 'ended'}
        />
      </div>
    </div>
  );
}
