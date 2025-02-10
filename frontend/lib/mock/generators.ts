import type { Animal, Region, ChecklistItem, Statistics, User, Show, Evaluation } from '../types/mock';

export function generateAnimals(count: number = 20): Animal[] {
  const breeds = ['North Country Cheviot', 'Border Leicester', 'Suffolk', 'Texel', 'Bluefaced Leicester'];
  const names = ['Highland Chief', 'Royal Star', 'Mountain King', 'Valley Prince', 'Forest Queen', 'Meadow Beauty'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `animal-${i + 1}`,
    name: `${names[Math.floor(Math.random() * names.length)]} ${i + 1}`,
    breed: breeds[Math.floor(Math.random() * breeds.length)],
    age: Math.floor(Math.random() * 5) + 1,
    status: 'Active',
    registrationNumber: `NCH${2025}${(i + 1).toString().padStart(4, '0')}`,
    birthDate: new Date(2024 - Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    images: [
      `/animals/sheep${(i % 3) + 1}.jpg`,
    ],
    scores: {
      movement: (Math.floor(Math.random() * 30) + 70) / 10,
      conformation: (Math.floor(Math.random() * 30) + 70) / 10,
      muscleDevelopment: (Math.floor(Math.random() * 30) + 70) / 10,
      breedCharacteristics: (Math.floor(Math.random() * 30) + 70) / 10,
    },
    notes: 'Excellent breed characteristics with strong confirmation. Shows promise for upcoming shows.',
    lastEvaluation: new Date(2025, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  }));
}

export function generateEvaluations(animals: Animal[]): Evaluation[] {
  return animals.flatMap(animal => {
    const evaluationCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: evaluationCount }, (_, i) => ({
      id: `eval-${animal.id}-${i + 1}`,
      animalId: animal.id,
      animalName: animal.name,
      date: new Date(2025, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      scores: {
        movement: (Math.floor(Math.random() * 30) + 70) / 10,
        conformation: (Math.floor(Math.random() * 30) + 70) / 10,
        muscleDevelopment: (Math.floor(Math.random() * 30) + 70) / 10,
        breedCharacteristics: (Math.floor(Math.random() * 30) + 70) / 10,
      },
      notes: `Evaluation ${i + 1} for ${animal.name}. ${
        i === 0 ? 'Initial assessment shows good potential.' :
        i === 1 ? 'Showing improvement in movement and muscle development.' :
        'Continued progress in all areas.'
      }`,
      images: [`/animals/sheep${(i % 3) + 1}.jpg`],
      evaluator: 'John Smith',
      overallScore: 0, // Calculated field
    }));
  });
}

export function generateShows(): Show[] {
  const locations = ['Edinburgh, Scotland', 'Kelso, Scotland', 'Perth, Scotland', 'Aberdeen, Scotland'];
  const categories = ['Breeding', 'Young Handler', 'Group', 'Performance', 'Championship'];
  
  return [
    {
      id: 'show-1',
      name: 'Royal Highland Show 2025',
      date: '2025-06-20',
      location: locations[0],
      status: 'upcoming',
      entryCount: 45,
      categories: categories.slice(0, 3),
      description: 'Premier agricultural show featuring the finest North Country Cheviot sheep.',
      entryFee: 50,
      maxEntries: 100,
      registrationDeadline: '2025-06-01',
      judgingCriteria: [
        'Breed characteristics',
        'Conformation',
        'Movement',
        'Overall presentation'
      ]
    },
    {
      id: 'show-2',
      name: 'Border Union Show 2025',
      date: '2025-07-15',
      location: locations[1],
      status: 'upcoming',
      entryCount: 32,
      categories: categories.slice(1, 4),
      description: 'Annual show celebrating border region livestock excellence.',
      entryFee: 40,
      maxEntries: 75,
      registrationDeadline: '2025-07-01',
      judgingCriteria: [
        'Breed standards',
        'Physical condition',
        'Handler presentation',
        'Movement quality'
      ]
    },
    {
      id: 'show-3',
      name: 'Perth Agricultural Show 2025',
      date: '2025-08-10',
      location: locations[2],
      status: 'upcoming',
      entryCount: 55,
      categories: categories,
      description: 'Comprehensive livestock show with special focus on breeding excellence.',
      entryFee: 45,
      maxEntries: 120,
      registrationDeadline: '2025-07-25',
      judgingCriteria: [
        'Breed characteristics',
        'Wool quality',
        'Structure and balance',
        'Overall condition'
      ]
    },
  ];
}

export function generateRegions(): Region[] {
  return [
    {
      name: 'Scottish Borders',
      areas: ['Kelso', 'Jedburgh', 'Hawick'],
      characteristics: [
        'Traditional breeding ground',
        'Extensive grazing systems',
        'Strong showing heritage',
      ],
      historicalData: 'The Scottish Borders region has been instrumental in developing the North Country Cheviot breed, with a rich history of show success.',
      showStats: {
        participationRate: 85,
        averageScore: 8.5,
        topBreeds: ['North Country Cheviot', 'Border Leicester', 'Texel'],
      },
    },
    {
      name: 'Highlands',
      areas: ['Inverness', 'Fort William', 'Aviemore'],
      characteristics: [
        'Hill farming expertise',
        'Hardy stock development',
        'Traditional methods',
      ],
      historicalData: 'Highland breeders have consistently produced robust and well-adapted North Country Cheviot sheep.',
      showStats: {
        participationRate: 78,
        averageScore: 8.2,
        topBreeds: ['North Country Cheviot', 'Scottish Blackface', 'Cheviot'],
      },
    },
  ];
}

export function generateChecklists(): ChecklistItem[] {
  return [
    {
      id: 'check-1',
      text: 'Complete show entry forms',
      completed: false,
      category: 'documentation',
      dueDate: '2025-03-01',
      assignedTo: 'John Smith',
    },
    {
      id: 'check-2',
      text: 'Schedule transportation to Royal Highland Show',
      completed: true,
      category: 'logistics',
      dueDate: '2025-02-28',
      assignedTo: 'Sarah Johnson',
    },
    {
      id: 'check-3',
      text: 'Prepare grooming equipment',
      completed: false,
      category: 'equipment',
      dueDate: '2025-02-25',
      assignedTo: 'David Wilson',
    },
    {
      id: 'check-4',
      text: 'Review show guidelines and rules',
      completed: false,
      category: 'preparation',
      dueDate: '2025-02-20',
      assignedTo: 'John Smith',
    },
    {
      id: 'check-5',
      text: 'Update health certificates',
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
    averageScores: {
      movement: 8.2,
      conformation: 8.5,
      muscleDevelopment: 8.3,
      breedCharacteristics: 8.7
    },
    showParticipation: {
      registered: 12,
      upcoming: 3,
      completed: 5
    },
    evaluationTrends: {
      lastMonth: 8,
      lastQuarter: 24,
      lastYear: 85
    }
  };
}

export function generateCurrentUser(): User {
  return {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Manager',
    avatar: '/placeholders/user-avatar.jpg',
    farm: 'Highland Cheviot Farm',
    location: 'Scottish Borders',
    memberSince: '2020-01-15'
  };
}