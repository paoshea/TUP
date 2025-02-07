import { NextRequest, NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';
import type { Animal, HistoricalFlock } from '@/types';

interface RequestBody {
  animal: Animal;
}

export async function POST(request: NextRequest) {
  try {
    const { animal } = (await request.json()) as RequestBody;
    
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

    // Fetch historical data for comparison
    const historicalFlocks = await db
      .collection<HistoricalFlock>('historical_flocks')
      .find({})
      .toArray();

    // Calculate overall score
    const scores = Object.values(animal.scores);
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Compare with historical flocks
    const comparisons = historicalFlocks.map((flock) => ({
      flockName: flock.name,
      similarity: calculateSimilarity(animal, flock),
      strengths: identifyStrengths(animal, flock),
      improvements: identifyImprovements(animal, flock),
    }));

    // Generate recommendations
    const recommendations = generateRecommendations(animal, comparisons);

    return NextResponse.json({
      score: overallScore,
      recommendations,
      comparisons,
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze animal' },
      { status: 500 }
    );
  }
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

function identifyStrengths(animal: Animal, flock: HistoricalFlock): string[] {
  const strengths: string[] = [];

  // Compare with historical metrics
  if (flock.key_metrics) {
    if (animal.scores.movement > (flock.key_metrics.movement || 0)) {
      strengths.push('Superior movement');
    }
    if (animal.scores.conformation > (flock.key_metrics.conformationScore || 0)) {
      strengths.push('Better conformation');
    }
    if (animal.scores.muscleDevelopment > (flock.key_metrics.muscleDevelopment || 0)) {
      strengths.push('Improved muscle development');
    }
    if (animal.scores.breedCharacteristics > (flock.key_metrics.breedCharacteristics || 0)) {
      strengths.push('Strong breed characteristics');
    }
  }

  return strengths;
}

function identifyImprovements(animal: Animal, flock: HistoricalFlock): string[] {
  const improvements: string[] = [];

  // Compare with historical metrics
  if (flock.key_metrics) {
    if (animal.scores.movement < (flock.key_metrics.movement || 0)) {
      improvements.push('Movement could be improved');
    }
    if (animal.scores.conformation < (flock.key_metrics.conformationScore || 0)) {
      improvements.push('Work on conformation');
    }
    if (animal.scores.muscleDevelopment < (flock.key_metrics.muscleDevelopment || 0)) {
      improvements.push('Focus on muscle development');
    }
    if (animal.scores.breedCharacteristics < (flock.key_metrics.breedCharacteristics || 0)) {
      improvements.push('Enhance breed characteristics');
    }
  }

  return improvements;
}

function generateRecommendations(animal: Animal, comparisons: {
  flockName: string;
  similarity: number;
  strengths: string[];
  improvements: string[];
}[]): string[] {
  const recommendations: string[] = [];

  // Add general recommendations based on scores
  Object.entries(animal.scores).forEach(([category, score]) => {
    if (score < 7) {
      recommendations.push(`Focus on improving ${category.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  });

  // Add recommendations based on historical comparisons
  const bestFlocks = comparisons
    .filter(c => c.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  if (bestFlocks.length > 0) {
    recommendations.push(
      `Consider studying practices from ${bestFlocks.map(f => f.flockName).join(', ')}`
    );
  }

  return recommendations;
}