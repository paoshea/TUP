import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/mongodb';
import type { Animal, EvaluationCriteria } from '@/types';

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

    // Fetch breed standards
    const breedStandard = await db
      .collection<EvaluationCriteria>('breed_standards')
      .findOne({
        breed: animal.breed,
        category: animal.category,
      });

    // Generate recommendations based on scores and breed standards
    const recommendations = generateRecommendations(animal, breedStandard);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

function generateRecommendations(
  animal: Animal,
  breedStandard: EvaluationCriteria | null
): string[] {
  const recommendations: string[] = [];

  // Add score-based recommendations
  Object.entries(animal.scores).forEach(([category, score]) => {
    if (score < 7) {
      recommendations.push(`Consider focusing on improving ${category.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  });

  // Add breed standard recommendations if available
  if (breedStandard) {
    const { frame, breedCharacter } = breedStandard.criteria.physical;

    // Check frame characteristics
    if (animal.scores.conformation < 8) {
      if (frame.heightAtWithers.weightage > 1.1) {
        recommendations.push('Pay attention to height at withers development');
      }
      if (frame.bodyLength.weightage > 1.1) {
        recommendations.push('Focus on achieving optimal body length');
      }
      if (frame.chestWidth.weightage > 1.1) {
        recommendations.push('Work on chest width and capacity');
      }
    }

    // Check breed characteristics
    if (animal.scores.breedCharacteristics < 8) {
      if (breedCharacter.headProfile.weightage > 1.1) {
        recommendations.push('Improve head profile characteristics');
      }
      if (breedCharacter.earSet.weightage > 1.1) {
        recommendations.push('Pay attention to ear set and carriage');
      }
    }
  }

  return recommendations;
}