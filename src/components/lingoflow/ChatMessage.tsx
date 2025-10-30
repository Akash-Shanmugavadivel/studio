"use client";

import { useState } from 'react';
import type { Message } from '@/app/app/page';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, User, Info, Languages, LoaderCircle } from 'lucide-react';
import WordPopover from './WordPopover';
import { translateSentence } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

type ChatMessageProps = {
  message: Message;
  onSaveVocab: (word: string) => void;
};

export default function ChatMessage({ message, onSaveVocab }: ChatMessageProps) {
  const [sentenceTranslation, setSentenceTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const isUser = message.role === 'user';
  const hasCorrection = message.correction?.isCorrected;

  const renderTextWithPopovers = (text: string) => {
    return text.split(/(\s+|[.,!?;:"])/).map((segment, index) => {
      // Don't make whitespace or punctuation into popovers
      if (segment.trim() === '' || /[.,!?;:"]/.test(segment)) {
        return <span key={index}>{segment}</span>;
      }
      return <WordPopover key={index} word={segment} onSaveVocab={onSaveVocab} />;
    });
  };

  const handleTranslateSentence = async () => {
    if (sentenceTranslation) {
      // Hide translation if already shown
      setSentenceTranslation(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      const result = await translateSentence(message.text);
      setSentenceTranslation(result.translation);
    } catch (error) {
      console.error('Sentence translation failed:', error);
      toast({ variant: "destructive", title: "Translation Error", description: "Could not translate the sentence." });
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <div className={`group flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="p-2 bg-primary/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><path d="M17 6.091V4.5a2.5 2.5 0 0 0-5 0v1.582A6.002 6.002 0 0 0 6 12c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.802-.79-3.412-2-4.518Z"/><path d="M12 18a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2a2 2 0 0 0-2-2Z"/><path d="m4.13 4.13 1.83 1.83"/><path d="M18.04 4.13l-1.83 1.83"/></svg>
        </div>
      )}
       <div className={`flex items-center gap-2 ${isUser ? 'order-2' : ''}`}>
        <div className={`max-w-md w-full`}>
          <Card className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
            <CardContent className="p-3 text-base">
              <p className="font-code">{renderTextWithPopovers(message.text)}</p>
            </CardContent>
          </Card>
          {sentenceTranslation && (
             <Card className="mt-2 bg-accent/20 border-accent/30">
               <CardContent className="p-3 text-sm text-accent-foreground/80">
                 {sentenceTranslation}
               </CardContent>
             </Card>
           )}
          {isUser && message.correction && (
            hasCorrection ? (
              <div className="mt-2 p-2 bg-green-950/50 border border-green-800/50 rounded-md">
                <p className="text-sm text-green-400">
                  <span className="font-semibold">Correction: </span>
                  {renderTextWithPopovers(message.correction.correctedText)}
                </p>
                <p className="text-sm text-green-400/80 mt-1">
                  <span className="font-semibold">Explanation: </span>
                  {message.correction.explanation}
                </p>
              </div>
            ) : (
               <div className="mt-2 flex items-center text-sm text-blue-400 gap-2 p-2 bg-blue-950/50 border border-blue-800/50 rounded-md">
                <Info className="h-4 w-4 shrink-0" />
                <span>No corrections needed. Great job!</span>
              </div>
            )
          )}
        </div>
        <button onClick={handleTranslateSentence} className="p-1 text-muted-foreground hover:text-foreground transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50" disabled={isTranslating}>
          {isTranslating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
        </button>
       </div>
      {isUser && (
        <div className="p-2 bg-muted rounded-full order-1">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
