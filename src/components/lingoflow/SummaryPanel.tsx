import type { Summary } from '@/app/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoaderCircle, FileText, BookMarked, RefreshCw, Lightbulb, Target, BookCopy } from 'lucide-react';

type SummaryPanelProps = {
  summary: Summary | null;
  isLoading: boolean;
  savedVocabulary: string[];
  onReset: () => void;
  sessionEnded: boolean;
};

export default function SummaryPanel({ summary, isLoading, savedVocabulary, onReset, sessionEnded }: SummaryPanelProps) {
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Session Summary
        </h2>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
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
          
          {!isLoading && !summary && sessionEnded && (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
                <p className="font-semibold">Could not generate summary.</p>
                <p className="text-sm">Please try another session.</p>
             </div>
          )}

          {!isLoading && summary && (
            <div className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/90">{summary.performanceOverview}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookCopy className="h-5 w-5" />
                     Key Vocabulary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {summary.keyVocabulary.map(word => (
                        <div key={word} className="bg-primary/10 text-primary-foreground font-medium text-sm px-3 py-1 rounded-full border border-primary/20 font-code">
                          {word}
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-5 w-5" />
                     Grammar Points to Review
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {summary.grammarPoints.map((point, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-sm">{point.point}</h4>
                      <p className="text-sm text-muted-foreground">{point.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5" />
                     Practice Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                    {summary.practiceSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
          
          {(sessionEnded && savedVocabulary.length > 0) && (
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookMarked className="h-5 w-5" />
                     All Saved Vocabulary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {savedVocabulary.map(word => (
                      <div key={word} className="bg-secondary text-secondary-foreground font-medium text-sm px-2.5 py-1 rounded-full font-code">
                        {word}
                      </div>
                    ))}
                  </div>
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
