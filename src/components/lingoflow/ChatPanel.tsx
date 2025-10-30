"use client";

import { useState, useRef, useEffect } from 'react';
import type { SubScenario } from '@/lib/scenarios';
import type { Message, SessionState } from '@/app/app/page';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, CornerDownLeft, LoaderCircle, PartyPopper, Mic } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { correctGerman } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

type ChatPanelProps = {
  scenario: SubScenario;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onEndSession: () => void;
  sessionState: SessionState;
  addCorrection: (explanation: string) => void;
  addSavedVocabulary: (word: string) => void;
};

export default function ChatPanel({
  scenario,
  messages,
  setMessages,
  onEndSession,
  sessionState,
  addCorrection,
  addSavedVocabulary
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || sessionState === 'ended') return;

    const newUserMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await correctGerman({ userMessage: input, scenario: scenario.title });
      const assistantMessage: Message = {
        role: 'assistant',
        text: result.correctedText,
        correction: {
          isCorrected: result.correction,
          correctedText: result.correctedText,
          explanation: result.explanationEn,
        },
      };

      if(result.correction) {
        addCorrection(result.explanationEn);
      }
      
      // Simulate AI response delay for a more natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
      });
      // remove the user message if AI fails
      setMessages(prev => prev.slice(0, -1));
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{scenario.title}</h2>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>
        {sessionState === 'active' && (
          <Button variant="destructive" onClick={onEndSession}>
            End Session
          </Button>
        )}
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} onSaveVocab={addSavedVocabulary} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><path d="M17 6.091V4.5a2.5 2.5 0 0 0-5 0v1.582A6.002 6.002 0 0 0 6 12c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.802-.79-3.412-2-4.518Z"/><path d="M12 18a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2a2 2 0 0 0-2-2Z"/><path d="m4.13 4.13 1.83 1.83"/><path d="M18.04 4.13l-1.83 1.83"/></svg>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <LoaderCircle className="animate-spin h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">LingoFlow is typing...</span>
              </div>
            </div>
          )}
          {sessionState === 'ended' && (
            <div className="text-center p-6 bg-secondary rounded-lg">
                <PartyPopper className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold">Session Complete!</h3>
                <p className="text-muted-foreground mt-2">Check out your session summary on the right.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            placeholder={sessionState === 'ended' ? 'Session has ended. Select a new scenario to start.' : `Message in ${scenario.title}...`}
            className="w-full pr-28 pl-10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading || sessionState === 'ended'}
          />
          <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-8 w-8" disabled>
            <Mic className="h-4 w-4" />
          </Button>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button type="submit" size="sm" disabled={isLoading || !input.trim() || sessionState === 'ended'}>
              Send <ArrowUp className="ml-2 h-4 w-4" />
            </Button>
            <p className="hidden md:block text-xs text-muted-foreground"><kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs"><CornerDownLeft /></span></kbd> to send</p>
          </div>
        </form>
      </div>
    </div>
  );
}
