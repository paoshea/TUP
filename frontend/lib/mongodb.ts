import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT || '10000'),
  socketTimeoutMS: 60000,
  connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT || '10000'),
  retryWrites: true,
  dbName: process.env.MONGODB_DB_NAME || 'livestock',
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .catch((error: Error) => {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch((error: Error) => {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise };