import type { Summary } from '@/app/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoaderCircle, FileText, BookMarked, RefreshCw } from 'lucide-react';

type SummaryPanelProps = {
  summary: Summary | null;
  isLoading: boolean;
  savedVocabulary: string[];
  onReset: () => void;
  sessionEnded: boolean;
};

export default function SummaryPanel({ summary, isLoading, savedVocabulary, onReset, sessionEnded }: SummaryPanelProps) {
  const renderSummary = (text: string) => {
    return text.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            return <li key={index} className="ml-4 mb-1 list-disc">{trimmedLine.substring(2)}</li>;
        }
        if (trimmedLine.length > 0 && (trimmedLine.includes(':') || trimmedLine.endsWith('.'))) {
            return <p key={index} className="mb-3">{trimmedLine}</p>;
        }
        if (trimmedLine.length > 0) {
            return <h4 key={index} className="font-semibold text-md mt-4 mb-2">{trimmedLine}</h4>
        }
        return null;
    });
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Session Summary
        </h2>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
              <LoaderCircle className="h-8 w-8 animate-spin mb-4" />
              <p className="font-semibold">Generating your summary...</p>
              <p className="text-sm">The AI is analyzing your session.</p>
            </div>
          )}

          {!isLoading && !sessionEnded && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
                <p className="font-semibold">Your summary will appear here.</p>
                <p className="text-sm">Complete your session to see your results.</p>
             </div>
          )}

          {!isLoading && summary && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-foreground/90 space-y-2">
                    {renderSummary(summary.summary)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {(sessionEnded || savedVocabulary.length > 0) && (
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5" />
                     Saved Vocabulary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {savedVocabulary.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {savedVocabulary.map(word => (
                        <div key={word} className="bg-primary/10 text-primary-foreground font-medium text-sm px-3 py-1 rounded-full border border-primary/20 font-code">
                          {word}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">You haven't saved any words yet. Tap on words in the chat to translate and save them.</p>
                  )}
                </CardContent>
              </Card>
          )}

        </div>
      </ScrollArea>

      {sessionEnded && (
        <div className="p-4 border-t">
          <Button onClick={onReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Session
          </Button>
        </div>
      )}
    </div>
  );
}
