import { faker } from '@faker-js/faker';
import type {
  Animal,
  ShowEntry,
  HealthRecord,
  Owner,
  Show,
  ShowCategory,
  ShowParticipant,
  Judge,
  Region,
  ChecklistItem,
  Evaluation,
  User
} from '../types/mock';

// Use data URLs for placeholder images
const placeholderImages = [
  '/next.svg',
  '/vercel.svg',
  '/globe.svg',
  '/window.svg',
  '/file.svg',
];

// Helper function to generate a random number between min and max
const randomScore = () => faker.number.int({ min: 6, max: 10 });

// Helper function to get random placeholder images
const getRandomImages = (count: number = 3) => {
  return Array.from(
    { length: faker.number.int({ min: 1, max: count }) },
    () => faker.helpers.arrayElement(placeholderImages)
  );
};

export const generateOwner = (): Owner => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  farm: `${faker.company.name()} Farm`,
  region: faker.location.state(),
});

export const generateHealthRecord = (): HealthRecord => ({
  id: faker.string.uuid(),
  date: faker.date.past(),
  type: faker.helpers.arrayElement(['vaccination', 'treatment', 'checkup']),
  description: faker.lorem.sentence(),
  veterinarian: faker.person.fullName(),
  nextFollowUp: faker.helpers.maybe(() => faker.date.future()),
});

export const generateShowEntry = (): ShowEntry => ({
  id: faker.string.uuid(),
  showName: `${faker.location.city()} Livestock Show`,
  date: faker.date.past(),
  location: faker.location.city(),
  placement: faker.number.int({ min: 1, max: 10 }),
  totalParticipants: faker.number.int({ min: 10, max: 50 }),
  category: faker.helpers.arrayElement(['Junior', 'Senior', 'Champion']),
  judge: faker.person.fullName(),
  notes: faker.lorem.paragraph(),
});

export const generateAnimal = (): Animal => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement([
    'Thunder', 'Storm', 'Duke', 'Princess', 'King', 'Queen',
    'Champion', 'Legend', 'Star', 'Diamond'
  ]),
  breed: faker.helpers.arrayElement([
    'Scottish Blackface', 'Cheviot', 'Suffolk', 'Highland',
    'North Country Cheviot', 'Hebridean'
  ]),
  age: faker.number.int({ min: 1, max: 10 }),
  weight: faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
  gender: faker.helpers.arrayElement(['male', 'female']),
  registrationNumber: faker.string.alphanumeric(8).toUpperCase(),
  images: getRandomImages(),
  scores: {
    movement: randomScore(),
    conformation: randomScore(),
    muscleDevelopment: randomScore(),
    breedCharacteristics: randomScore(),
  },
  notes: faker.lorem.paragraphs(2),
  showHistory: Array.from(
    { length: faker.number.int({ min: 0, max: 5 }) },
    generateShowEntry
  ),
  healthRecords: Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    generateHealthRecord
  ),
  owner: generateOwner(),
});

export const generateJudge = (): Judge => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  specialization: Array.from(
    { length: faker.number.int({ min: 1, max: 3 }) },
    () => faker.helpers.arrayElement([
      'Dairy Cattle', 'Beef Cattle', 'Sheep', 'Goats', 'Swine',
      'Equine', 'Poultry'
    ])
  ),
  experience: faker.number.int({ min: 5, max: 30 }),
  certifications: Array.from(
    { length: faker.number.int({ min: 1, max: 3 }) },
    () => faker.helpers.arrayElement([
      'International Livestock Judge',
      'Master Breed Evaluator',
      'Show Ring Excellence',
      'Breed Standards Specialist'
    ])
  ),
});

export const generateShowCategory = (): ShowCategory => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement([
    'Junior Ewe', 'Senior Ram', 'Yearling Ewe',
    'Champion Ram', 'Market Lamb'
  ]),
  breed: faker.helpers.arrayElement([
    'Scottish Blackface', 'Cheviot', 'Suffolk',
    'Highland', 'North Country Cheviot'
  ]),
  ageGroup: faker.helpers.arrayElement([
    'Junior', 'Yearling', 'Senior', 'Mature'
  ]),
  gender: faker.helpers.arrayElement(['male', 'female', 'any']),
  participantCount: faker.number.int({ min: 5, max: 30 }),
});

export const generateShow = (): Show => {
  const startDate = faker.date.future();
  return {
    id: faker.string.uuid(),
    name: `${faker.location.city()} ${faker.date.future().getFullYear()} Livestock Show`,
    startDate,
    endDate: faker.date.soon({ days: 3, refDate: startDate }),
    location: `${faker.location.city()} Exhibition Center`,
    categories: Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      generateShowCategory
    ),
    participants: Array.from(
      { length: faker.number.int({ min: 10, max: 50 }) },
      (): ShowParticipant => ({
        id: faker.string.uuid(),
        animalId: faker.string.uuid(),
        categoryId: faker.string.uuid(),
        registrationDate: faker.date.past(),
        status: faker.helpers.arrayElement([
          'pending', 'confirmed', 'withdrawn'
        ]),
        placement: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10 })),
      })
    ),
    judges: Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      generateJudge
    ),
    status: faker.helpers.arrayElement([
      'upcoming', 'ongoing', 'completed'
    ]),
  };
};

export const generateRegion = (): Region => ({
  name: `${faker.location.state()} Region`,
  areas: Array.from(
    { length: faker.number.int({ min: 2, max: 4 }) },
    () => faker.location.county()
  ),
  characteristics: Array.from(
    { length: faker.number.int({ min: 2, max: 4 }) },
    () => faker.lorem.sentence()
  ),
  historicalData: faker.lorem.paragraph(),
  showStats: {
    participationRate: faker.number.int({ min: 60, max: 95 }),
    averageScore: faker.number.float({ min: 7.0, max: 9.5, fractionDigits: 1 }),
    topBreeds: Array.from(
      { length: 3 },
      () => faker.helpers.arrayElement([
        'Scottish Blackface', 'Cheviot', 'Suffolk',
        'Highland', 'North Country Cheviot', 'Hebridean'
      ])
    ),
  },
});

export const generateChecklistItem = (): ChecklistItem => ({
  id: faker.string.uuid(),
  text: faker.lorem.sentence(),
  completed: faker.datatype.boolean(),
  category: faker.helpers.arrayElement([
    'preparation', 'documentation', 'equipment', 'health', 'general'
  ]),
  dueDate: faker.helpers.maybe(() => faker.date.future()),
  assignedTo: faker.helpers.maybe(() => faker.person.fullName()),
});

export const generateEvaluation = (): Evaluation => ({
  id: faker.string.uuid(),
  animalId: faker.string.uuid(),
  date: faker.date.recent(),
  evaluator: faker.person.fullName(),
  scores: {
    movement: randomScore(),
    conformation: randomScore(),
    muscleDevelopment: randomScore(),
    breedCharacteristics: randomScore(),
  },
  notes: faker.lorem.paragraphs(2),
  images: getRandomImages(2),
  recommendations: Array.from(
    { length: faker.number.int({ min: 1, max: 3 }) },
    () => faker.lorem.sentence()
  ),
});

export const generateUser = (): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement([
    'owner', 'handler', 'judge', 'admin'
  ]),
  organization: faker.company.name(),
  preferences: {
    notifications: faker.datatype.boolean(),
    theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
    language: faker.helpers.arrayElement(['en', 'es', 'fr']),
  },
});