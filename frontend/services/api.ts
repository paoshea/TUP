import { clientPromise, ObjectId } from './mongodb';
import type { Animal, EvaluationCriteria } from '../types';
import { Document, WithId } from 'mongodb';

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

interface EvaluationCriteriaDocument extends Document {
  category: string;
  criteria: {
    name: string;
    description: string;
    maxScore: number;
  }[];
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

export const api = {
  animals: {
    list: async () => {
      const client = await clientPromise;
      const db = client.db();
      const data = await db
        .collection<AnimalDocument>('animals')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return data.map(mapAnimalDocument);
    },

    get: async (id: string) => {
      const client = await clientPromise;
      const db = client.db();
      const data = await db
        .collection<AnimalDocument>('animals')
        .findOne({ _id: new ObjectId(id) });

      if (!data) throw new Error('Animal not found');

      return mapAnimalDocument(data);
    },

    create: async (animal: Omit<Animal, 'id'>) => {
      const client = await clientPromise;
      const db = client.db();
      const result = await db
        .collection<AnimalDocument>('animals')
        .insertOne({
          ...animal,
          createdAt: new Date(),
        } as AnimalDocument);

      return {
        ...animal,
        id: result.insertedId.toString(),
      };
    },

    update: async (id: string, updates: Partial<Animal>) => {
      const client = await clientPromise;
      const db = client.db();
      const result = await db
        .collection<AnimalDocument>('animals')
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updates },
          { returnDocument: 'after' }
        );

      if (!result) throw new Error('Animal not found');

      return mapAnimalDocument(result);
    },

    delete: async (id: string) => {
      const client = await clientPromise;
      const db = client.db();
      const result = await db
        .collection('animals')
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        throw new Error('Animal not found');
      }
    },
  },

  evaluations: {
    getCriteria: async (): Promise<EvaluationCriteria[]> => {
      const client = await clientPromise;
      const db = client.db();
      const data = await db
        .collection<EvaluationCriteriaDocument>('evaluation_criteria')
        .find({})
        .sort({ category: 1 })
        .toArray();

      return data.map(doc => ({
        category: doc.category,
        criteria: doc.criteria,
      }));
    },

    saveCriteria: async (criteria: EvaluationCriteria) => {
      const client = await clientPromise;
      const db = client.db();
      const result = await db
        .collection<EvaluationCriteriaDocument>('evaluation_criteria')
        .insertOne({
          ...criteria,
          createdAt: new Date(),
        } as EvaluationCriteriaDocument);

      return {
        ...criteria,
        id: result.insertedId.toString(),
      };
    },
  },
};