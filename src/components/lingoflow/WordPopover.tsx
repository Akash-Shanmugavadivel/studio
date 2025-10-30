"use client";

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { BookPlus, LoaderCircle, Check } from 'lucide-react';
import { translateWord } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

type WordPopoverProps = {
  word: string;
  onSaveVocab: (word: string) => void;
};

type Translation = {
  translation: string;
  pos: string;
};

export default function WordPopover({ word, onSaveVocab }: WordPopoverProps) {
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDoubleClick = async () => {
    setIsOpen(true);
    if (!translation) {
      setIsLoading(true);
      try {
        const result = await translateWord(word);
        setTranslation(result);
      } catch (error) {
        console.error('Translation failed:', error);
        toast({ variant: "destructive", title: "Translation Error", description: "Could not translate the word." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = () => {
    onSaveVocab(word);
    setIsSaved(true);
    toast({ title: "Vocabulary Saved!", description: `"${word}" has been added to your list.` });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer hover:bg-accent/20 rounded-md p-0.5 -m-0.5 transition-colors duration-200"
        >
          {word}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-code">{word}</h4>
            <p className="text-sm text-muted-foreground">Translation</p>
          </div>
          <div className="min-h-[4rem]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : translation ? (
              <div className="space-y-1">
                <p className="text-2xl font-bold">{translation.translation}</p>
                <Badge variant="outline">{translation.pos}</Badge>
              </div>
            ) : (
                <p className="text-sm text-muted-foreground">Could not find translation.</p>
            )}
          </div>
          <Button onClick={handleSave} disabled={isSaved || !translation} className="w-full">
            {isSaved ? <Check className="mr-2 h-4 w-4" /> : <BookPlus className="mr-2 h-4 w-4" />}
            {isSaved ? 'Saved' : 'Save to Vocab'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
