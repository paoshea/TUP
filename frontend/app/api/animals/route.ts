import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { clientPromise } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const client = await clientPromise;
    const db = client.db();

    if (id) {
      // Get single animal
      const animal = await db
        .collection('animals')
        .findOne({ _id: new ObjectId(id) });

      if (!animal) {
        return NextResponse.json(
          { error: 'Animal not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...animal,
        id: animal._id.toString(),
      });
    } else {
      // List all animals
      const animals = await db
        .collection('animals')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json(
        animals.map(animal => ({
          ...animal,
          id: animal._id.toString(),
        }))
      );
    }
  } catch (error) {
    console.error('Get animals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch animals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('animals')
      .insertOne({
        ...data,
        createdAt: new Date(),
      });

    return NextResponse.json({
      ...data,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Create animal error:', error);
    return NextResponse.json(
      { error: 'Failed to create animal' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updates = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('animals')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...result,
      id: result._id.toString(),
    });
  } catch (error) {
    console.error('Update animal error:', error);
    return NextResponse.json(
      { error: 'Failed to update animal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('animals')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete animal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete animal' },
      { status: 500 }
    );
  }
}