import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, MessageCircle, BookCheck, Repeat } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-conversation');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 6.091V4.5a2.5 2.5 0 0 0-5 0v1.582A6.002 6.002 0 0 0 6 12c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.802-.79-3.412-2-4.518Z"/><path d="M12 18a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2a2 2 0 0 0-2-2Z"/><path d="m4.13 4.13 1.83 1.83"/><path d="M18.04 4.13l-1.83 1.83"/></svg>
            <h1 className="text-2xl font-bold text-foreground">LingoFlow AI</h1>
          </Link>
          <Button asChild>
            <Link href="/app">
              Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-foreground">
              Master German with Your Personal AI Conversation Coach
            </h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              Practice real-life conversations with an AI tutor that provides contextual corrections, instant translations, and session summaries.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/app">
                  Start Your Free Session <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
           {heroImage && (
            <div className="relative aspect-video max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
           )}
        </section>

        <section className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-headline font-bold">How LingoFlow Works</h3>
              <p className="mt-4 text-lg text-muted-foreground">A better way to practice, correct, and retain a new language.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Practice Conversations</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Choose from real-life scenarios like ordering in a café or participating in an office meeting.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <BookCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Get Contextual Corrections</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Receive gentle, in-context feedback on your grammar and phrasing, with clear explanations.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Repeat className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Review & Retain</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">End each session with a summary, highlighting new vocabulary and key corrections to help you learn.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LingoFlow AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
