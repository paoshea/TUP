import { clientPromise, ObjectId } from './mongodb';
import type { Animal } from '../types';
import { WithId, Document } from 'mongodb';

interface AnimalDocument extends Document {
  name: string;
  category: string;
  breed: string;
  region: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  images: string[];
  createdAt: Date;
}

interface AIAnalysis {
  score: number;
  recommendations: string[];
  comparisons: ComparisonResult[];
}

interface ComparisonResult {
  flockName: string;
  similarity: number;
  strengths: string[];
  improvements: string[];
}

const mapAnimalDocument = (doc: WithId<AnimalDocument>): Animal => ({
  id: doc._id.toString(),
  name: doc.name,
  category: doc.category,
  breed: doc.breed,
  region: doc.region,
  scores: doc.scores,
  notes: doc.notes,
  images: doc.images,
});

export const ai = {
  async analyzeAnimal(animal: Animal): Promise<AIAnalysis> {
    try {
      const client = await clientPromise;
      const db = client.db();

      // Get historical data for comparison
      const historicalData = await db
        .collection<AnimalDocument>('animals')
        .find({
          category: animal.category,
          breed: animal.breed,
          _id: { $ne: new ObjectId(animal.id) }
        })
        .limit(10)
        .toArray();

      // Calculate similarity scores
      const comparisons = historicalData.map(historical => {
        const mappedHistorical = mapAnimalDocument(historical);
        const similarity = calculateSimilarity(animal, mappedHistorical);
        return {
          flockName: mappedHistorical.name,
          similarity,
          strengths: findStrengths(animal, mappedHistorical),
          improvements: findImprovements(animal, mappedHistorical)
        };
      });

      // Calculate overall score
      const score = calculateOverallScore(animal);

      // Generate recommendations based on mapped historical data
      const recommendations = generateRecommendations(animal, historicalData.map(mapAnimalDocument));

      return {
        score,
        recommendations,
        comparisons: comparisons.sort((a, b) => b.similarity - a.similarity)
      };
    } catch (error) {
      throw new Error(`Failed to analyze animal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async getRecommendations(animalId: string): Promise<string[]> {
    try {
      const client = await clientPromise;
      const db = client.db();

      const animal = await db
        .collection<AnimalDocument>('animals')
        .findOne({ _id: new ObjectId(animalId) });

      if (!animal) {
        throw new Error('Animal not found');
      }

      const mappedAnimal = mapAnimalDocument(animal);

      // Get historical data for similar animals
      const historicalData = await db
        .collection<AnimalDocument>('animals')
        .find({
          category: mappedAnimal.category,
          breed: mappedAnimal.breed,
          _id: { $ne: new ObjectId(animalId) }
        })
        .limit(5)
        .toArray();

      const mappedHistorical = historicalData.map(mapAnimalDocument);
      return generateRecommendations(mappedAnimal, mappedHistorical);
    } catch (error) {
      throw new Error(`Failed to get recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async compareWithHistorical(animalId: string): Promise<{
    similarFlocks: string[];
    analysis: string;
  }> {
    try {
      const client = await clientPromise;
      const db = client.db();

      const animal = await db
        .collection<AnimalDocument>('animals')
        .findOne({ _id: new ObjectId(animalId) });

      if (!animal) {
        throw new Error('Animal not found');
      }

      const mappedAnimal = mapAnimalDocument(animal);

      const historicalData = await db
        .collection<AnimalDocument>('animals')
        .find({
          category: mappedAnimal.category,
          breed: mappedAnimal.breed,
          _id: { $ne: new ObjectId(animalId) }
        })
        .limit(5)
        .toArray();

      const mappedHistorical = historicalData.map(mapAnimalDocument);
      const similarFlocks = mappedHistorical.map(h => h.name);
      const analysis = generateAnalysis(mappedAnimal, mappedHistorical);

      return {
        similarFlocks,
        analysis
      };
    } catch (error) {
      throw new Error(`Failed to compare with historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Helper functions
function calculateSimilarity(animal: Animal, historical: Animal): number {
  // Calculate similarity based on scores
  const scores = [
    Math.abs(animal.scores.movement - historical.scores.movement),
    Math.abs(animal.scores.conformation - historical.scores.conformation),
    Math.abs(animal.scores.muscleDevelopment - historical.scores.muscleDevelopment),
    Math.abs(animal.scores.breedCharacteristics - historical.scores.breedCharacteristics)
  ];

  // Convert differences to similarity (0-100)
  return 100 - (scores.reduce((a, b) => a + b, 0) / scores.length) * 10;
}

function findStrengths(animal: Animal, historical: Animal): string[] {
  const strengths: string[] = [];
  
  if (animal.scores.movement > historical.scores.movement) {
    strengths.push('Superior movement');
  }
  if (animal.scores.conformation > historical.scores.conformation) {
    strengths.push('Better conformation');
  }
  if (animal.scores.muscleDevelopment > historical.scores.muscleDevelopment) {
    strengths.push('Improved muscle development');
  }
  if (animal.scores.breedCharacteristics > historical.scores.breedCharacteristics) {
    strengths.push('Strong breed characteristics');
  }

  return strengths;
}

function findImprovements(animal: Animal, historical: Animal): string[] {
  const improvements: string[] = [];
  
  if (animal.scores.movement < historical.scores.movement) {
    improvements.push('Movement could be improved');
  }
  if (animal.scores.conformation < historical.scores.conformation) {
    improvements.push('Work on conformation');
  }
  if (animal.scores.muscleDevelopment < historical.scores.muscleDevelopment) {
    improvements.push('Focus on muscle development');
  }
  if (animal.scores.breedCharacteristics < historical.scores.breedCharacteristics) {
    improvements.push('Enhance breed characteristics');
  }

  return improvements;
}

function calculateOverallScore(animal: Animal): number {
  const weights = {
    movement: 0.25,
    conformation: 0.3,
    muscleDevelopment: 0.25,
    breedCharacteristics: 0.2
  };

  return Math.round(
    animal.scores.movement * weights.movement +
    animal.scores.conformation * weights.conformation +
    animal.scores.muscleDevelopment * weights.muscleDevelopment +
    animal.scores.breedCharacteristics * weights.breedCharacteristics * 10
  );
}

function generateRecommendations(animal: Animal, historicalData: Animal[]): string[] {
  const recommendations: string[] = [];

  // Add general recommendations based on scores
  Object.entries(animal.scores).forEach(([category, score]) => {
    if (score < 7) {
      recommendations.push(`Focus on improving ${category.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  });

  // Add specific recommendations based on comparisons
  const avgScores = {
    movement: 0,
    conformation: 0,
    muscleDevelopment: 0,
    breedCharacteristics: 0
  };

  historicalData.forEach(comp => {
    avgScores.movement += comp.scores.movement;
    avgScores.conformation += comp.scores.conformation;
    avgScores.muscleDevelopment += comp.scores.muscleDevelopment;
    avgScores.breedCharacteristics += comp.scores.breedCharacteristics;
  });

  Object.entries(avgScores).forEach(([category, total]) => {
    const avg = total / historicalData.length;
    const score = animal.scores[category as keyof typeof animal.scores];
    if (score < avg) {
      recommendations.push(
        `${category.replace(/([A-Z])/g, ' $1').toLowerCase()} is below average for this breed`
      );
    }
  });

  return recommendations;
}

function generateAnalysis(animal: Animal, historicalData: Animal[]): string {
  const avgScores = {
    movement: 0,
    conformation: 0,
    muscleDevelopment: 0,
    breedCharacteristics: 0
  };

  historicalData.forEach(historical => {
    avgScores.movement += historical.scores.movement;
    avgScores.conformation += historical.scores.conformation;
    avgScores.muscleDevelopment += historical.scores.muscleDevelopment;
    avgScores.breedCharacteristics += historical.scores.breedCharacteristics;
  });

  Object.keys(avgScores).forEach(key => {
    avgScores[key as keyof typeof avgScores] /= historicalData.length;
  });

  return `
    Analysis Summary:
    - Movement: ${compareScore(animal.scores.movement, avgScores.movement)}
    - Conformation: ${compareScore(animal.scores.conformation, avgScores.conformation)}
    - Muscle Development: ${compareScore(animal.scores.muscleDevelopment, avgScores.muscleDevelopment)}
    - Breed Characteristics: ${compareScore(animal.scores.breedCharacteristics, avgScores.breedCharacteristics)}
  `;
}

function compareScore(score: number, avg: number): string {
  const diff = score - avg;
  if (diff > 1) return `Above average (+${diff.toFixed(1)})`;
  if (diff < -1) return `Below average (${diff.toFixed(1)})`;
  return 'Average';
}