import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/mongodb';
import type { Animal, HistoricalFlock } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const animalId = searchParams.get('animalId');

    if (!animalId) {
      return NextResponse.json(
        { error: 'Animal ID is required' },
        { status: 400 }
      );
    }

    let client;
    try {
      client = await clientPromise;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const db = client.db();

    // Fetch animal data
    const animal = await db
      .collection<Animal>('animals')
      .findOne({ _id: new ObjectId(animalId) });

    if (!animal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      );
    }

    // Fetch historical flocks
    const historicalFlocks = await db
      .collection<HistoricalFlock>('historical_flocks')
      .find({ regions: { $in: [animal.region] } })
      .toArray();

    // Find similar flocks and analyze
    const similarFlocks = findSimilarFlocks(animal, historicalFlocks);
    const analysis = generateAnalysis(animal, similarFlocks);

    return NextResponse.json({
      similarFlocks: similarFlocks.map(f => f.name),
      analysis,
    });
  } catch (error) {
    console.error('Historical comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to perform historical comparison' },
      { status: 500 }
    );
  }
}

function findSimilarFlocks(animal: Animal, historicalFlocks: HistoricalFlock[]): HistoricalFlock[] {
  return historicalFlocks
    .map(flock => ({
      ...flock,
      similarity: calculateSimilarity(animal, flock),
    }))
    .filter(flock => flock.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}

function calculateSimilarity(animal: Animal, flock: HistoricalFlock): number {
  // Calculate breed match
  const breedMatch = animal.breed === flock.breed ? 1 : 0;
  
  // Calculate region match
  const regionMatch = flock.regions.includes(animal.region) ? 1 : 0;

  // Calculate score similarity
  let scoresSimilarity = 0;
  if (flock.key_metrics) {
    const metrics = {
      movement: flock.key_metrics.movement || 0,
      conformation: flock.key_metrics.conformationScore || 0,
      muscleDevelopment: flock.key_metrics.muscleDevelopment || 0,
      breedCharacteristics: flock.key_metrics.breedCharacteristics || 0,
    };

    const scoreDiffs = Object.keys(animal.scores).map(key => {
      const animalScore = animal.scores[key as keyof typeof animal.scores];
      const flockScore = metrics[key as keyof typeof metrics];
      return Math.abs(animalScore - flockScore) / 10;
    });

    scoresSimilarity = 1 - (scoreDiffs.reduce((a, b) => a + b, 0) / scoreDiffs.length);
  }

  // Weight the factors
  const weights = {
    breed: 0.4,
    region: 0.2,
    scores: 0.4,
  };

  return (
    breedMatch * weights.breed +
    regionMatch * weights.region +
    scoresSimilarity * weights.scores
  );
}

function generateAnalysis(animal: Animal, similarFlocks: HistoricalFlock[]): string {
  if (similarFlocks.length === 0) {
    return 'No similar historical flocks found for comparison.';
  }

  const flockNames = similarFlocks.map(f => f.name).join(', ');
  const traits: string[] = [];

  // Analyze breed characteristics
  if (animal.scores.breedCharacteristics >= 8) {
    traits.push('strong breed character');
  }

  // Analyze conformation
  if (animal.scores.conformation >= 8) {
    traits.push('excellent conformation');
  }

  // Analyze movement
  if (animal.scores.movement >= 8) {
    traits.push('superior movement');
  }

  // Analyze muscle development
  if (animal.scores.muscleDevelopment >= 8) {
    traits.push('impressive muscle development');
  }

  const traitsText = traits.length > 0
    ? `Notable traits include ${traits.join(' and ')}.`
    : '';

  return `
    Based on historical data, this animal shows characteristics similar to ${flockNames}. 
    ${traitsText}
    These flocks have historically demonstrated success in the ${animal.region} region.
  `.trim();
}