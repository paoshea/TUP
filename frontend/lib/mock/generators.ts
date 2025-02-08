import type { Animal, Region, ChecklistItem, Statistics, User, Show } from '../types/mock';

export function generateAnimals(count: number = 20): Animal[] {
  const breeds = ['Angus', 'Hereford', 'Charolais', 'Simmental', 'Limousin'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `animal-${i + 1}`,
    name: `Animal ${i + 1}`,
    breed: breeds[Math.floor(Math.random() * breeds.length)],
    age: Math.floor(Math.random() * 5) + 1,
    weight: Math.floor(Math.random() * 500) + 500,
    images: [
      'https://placehold.co/600x400?text=Animal+Photo+1',
      'https://placehold.co/600x400?text=Animal+Photo+2',
      'https://placehold.co/600x400?text=Animal+Photo+3',
    ],
    scores: {
      movement: Math.floor(Math.random() * 3) + 7,
      conformation: Math.floor(Math.random() * 3) + 7,
      muscleDevelopment: Math.floor(Math.random() * 3) + 7,
      breedCharacteristics: Math.floor(Math.random() * 3) + 7,
    },
    notes: 'Sample evaluation notes for this animal.',
  }));
}

export function generateShows(): Show[] {
  const locations = ['Central Fairgrounds', 'State Exhibition Center', 'Regional Show Arena'];
  const categories = ['Junior', 'Senior', 'Yearling', 'Breeding', 'Market'];
  
  return [
    {
      id: 'show-1',
      name: 'Spring Livestock Exhibition',
      date: '2025-03-15',
      location: locations[0],
      status: 'upcoming',
      participants: 45,
      categories: categories.slice(0, 3),
    },
    {
      id: 'show-2',
      name: 'Regional Cattle Show',
      date: '2025-04-20',
      location: locations[1],
      status: 'upcoming',
      participants: 60,
      categories: categories.slice(1, 4),
    },
    {
      id: 'show-3',
      name: 'National Livestock Competition',
      date: '2025-05-10',
      location: locations[2],
      status: 'upcoming',
      participants: 85,
      categories: categories,
    },
  ];
}

export function generateRegions(): Region[] {
  return [
    {
      name: 'North Region',
      areas: ['Area 1', 'Area 2', 'Area 3'],
      characteristics: [
        'High altitude grazing',
        'Traditional breeding practices',
        'Strong community support',
      ],
      historicalData: 'Historical performance data for the North Region shows consistent improvement in breed quality over the past 5 years.',
      showStats: {
        participationRate: 85,
        averageScore: 8.5,
        topBreeds: ['Angus', 'Hereford', 'Charolais'],
      },
    },
    {
      name: 'South Region',
      areas: ['Area 4', 'Area 5', 'Area 6'],
      characteristics: [
        'Coastal climate',
        'Modern facilities',
        'Export-focused',
      ],
      historicalData: 'The South Region has seen significant investment in infrastructure and technology adoption.',
      showStats: {
        participationRate: 78,
        averageScore: 8.2,
        topBreeds: ['Simmental', 'Limousin', 'Angus'],
      },
    },
  ];
}

export function generateChecklists(): ChecklistItem[] {
  return [
    {
      id: 'check-1',
      text: 'Complete health certificates',
      completed: false,
      category: 'documentation',
      dueDate: '2025-03-01',
      assignedTo: 'John Smith',
    },
    {
      id: 'check-2',
      text: 'Schedule transportation',
      completed: true,
      category: 'preparation',
      dueDate: '2025-02-28',
      assignedTo: 'Sarah Johnson',
    },
    {
      id: 'check-3',
      text: 'Prepare grooming equipment',
      completed: false,
      category: 'equipment',
      dueDate: '2025-02-25',
    },
    {
      id: 'check-4',
      text: 'Review show guidelines',
      completed: false,
      category: 'preparation',
      dueDate: '2025-02-20',
    },
    {
      id: 'check-5',
      text: 'Update vaccination records',
      completed: true,
      category: 'health',
      dueDate: '2025-02-15',
      assignedTo: 'Dr. Thompson',
    },
  ];
}

export function generateStatistics(): Statistics {
  return {
    totalAnimals: 20,
    upcomingShows: 3,
    completedEvaluations: 15,
    activeUsers: 8,
  };
}

export function generateCurrentUser(): User {
  return {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Manager',
    avatar: 'https://placehold.co/40x40?text=JS',
  };
}