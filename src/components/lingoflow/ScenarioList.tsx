import type { Scenario, SubScenario } from '@/lib/scenarios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ScenarioListProps = {
  scenarios: Scenario[];
  onScenarioSelect: (scenario: SubScenario) => void;
  activeScenario: SubScenario | null;
};

export default function ScenarioList({ scenarios, onScenarioSelect, activeScenario }: ScenarioListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6"><path d="M17 6.091V4.5a2.5 2.5 0 0 0-5 0v1.582A6.002 6.002 0 0 0 6 12c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.802-.79-3.412-2-4.518Z"/><path d="M12 18a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2a2 2 0 0 0-2-2Z"/><path d="m4.13 4.13 1.83 1.83"/><path d="M18.04 4.13l-1.83 1.83"/></svg>
            <h1 className="text-xl font-bold text-foreground">LingoFlow AI</h1>
        </Link>
      </div>
      <div className="flex-grow overflow-auto p-4">
        <h2 className="text-lg font-semibold mb-2 px-2">Scenarios</h2>
        <Accordion type="multiple" defaultValue={scenarios.map(s => s.category)} className="w-full">
          {scenarios.map((scenario) => (
            <AccordionItem value={scenario.category} key={scenario.category}>
              <AccordionTrigger className="text-base font-medium hover:no-underline px-2">
                <div className="flex items-center gap-3">
                  <scenario.icon className="h-5 w-5 text-muted-foreground" />
                  {scenario.category}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="flex flex-col gap-1">
                  {scenario.subScenarios.map((sub) => (
                    <Button
                      key={sub.id}
                      variant={activeScenario?.id === sub.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start h-auto py-2 px-3 text-left"
                      onClick={() => onScenarioSelect(sub)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{sub.title}</span>
                        <span className="text-xs text-muted-foreground">{sub.description}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
