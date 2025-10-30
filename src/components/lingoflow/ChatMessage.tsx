import type { Message } from '@/app/app/page';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, User, Info } from 'lucide-react';
import WordPopover from './WordPopover';

type ChatMessageProps = {
  message: Message;
  onSaveVocab: (word: string) => void;
};

export default function ChatMessage({ message, onSaveVocab }: ChatMessageProps) {
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

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="p-2 bg-primary/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><path d="M17 6.091V4.5a2.5 2.5 0 0 0-5 0v1.582A6.002 6.002 0 0 0 6 12c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.802-.79-3.412-2-4.518Z"/><path d="M12 18a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2a2 2 0 0 0-2-2Z"/><path d="m4.13 4.13 1.83 1.83"/><path d="M18.04 4.13l-1.83 1.83"/></svg>
        </div>
      )}
      <div className={`max-w-md w-full ${isUser ? 'order-1' : ''}`}>
        <Card className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
          <CardContent className="p-3 text-base">
            <p className="font-code">{renderTextWithPopovers(message.text)}</p>
          </CardContent>
        </Card>
        {!isUser && message.correction && (
          hasCorrection ? (
            <div className="mt-2 flex items-start text-sm text-green-400 gap-2 p-2 bg-green-950/50 border border-green-800/50 rounded-md">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{renderTextWithPopovers(message.correction.explanation)}</span>
            </div>
          ) : (
             <div className="mt-2 flex items-center text-sm text-blue-400 gap-2 p-2 bg-blue-950/50 border border-blue-800/50 rounded-md">
              <Info className="h-4 w-4 shrink-0" />
              <span>No corrections needed. Great job!</span>
            </div>
          )
        )}
      </div>
      {isUser && (
        <div className="p-2 bg-muted rounded-full order-2">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
