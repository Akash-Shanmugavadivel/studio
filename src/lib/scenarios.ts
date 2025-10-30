import { Coffee, Briefcase } from 'lucide-react';

export type SubScenario = {
  id: string;
  title: string;
  description: string;
  welcomeMessage: string;
  level: 'A1-A2' | 'A2-B1';
};

export type Scenario = {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  subScenarios: SubScenario[];
};


export const scenarios: Scenario[] = [
  {
    category: 'Travel',
    icon: Coffee,
    subScenarios: [
      {
        id: 'cafe',
        title: 'Ordering in a Café',
        description: 'Practice ordering coffee and pastries.',
        welcomeMessage: 'Hallo! Willkommen im Café. Was möchten Sie bestellen?',
        level: 'A1-A2',
      },
      {
        id: 'airport-checkin',
        title: 'Airport Check-in',
        description: 'Check in for your flight and ask about your gate.',
        welcomeMessage: 'Guten Tag. Herzlich willkommen am Check-in. Kann ich bitte Ihren Pass und Ihr Ticket sehen?',
        level: 'A1-A2',
      },
      {
        id: 'hotel-reception',
        title: 'Hotel Reception',
        description: 'Check into your hotel room.',
        welcomeMessage: 'Herzlich willkommen im Hotel. Haben Sie eine Reservierung?',
        level: 'A2-B1',
      },
    ],
  },
  {
    category: 'Office',
    icon: Briefcase,
    subScenarios: [
      {
        id: 'meeting-intro',
        title: 'Meeting Introduction',
        description: 'Introduce yourself at the start of a meeting.',
        welcomeMessage: 'Guten Morgen allerseits. Bevor wir anfangen, stellen wir uns kurz vor. Möchten Sie beginnen?',
        level: 'A2-B1',
      },
      {
        id: 'scheduling-appointment',
        title: 'Scheduling an Appointment',
        description: 'Arrange a meeting with a colleague.',
        welcomeMessage: 'Hallo, ich würde gerne einen Termin mit Ihnen vereinbaren, um das neue Projekt zu besprechen. Wann würde es Ihnen passen?',
        level: 'A2-B1',
      },
    ],
  },
];
