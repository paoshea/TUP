import { MongoClient } from 'mongodb';

// Set default MongoDB URI for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/livestock';

// MongoDB connection options
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
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect()
      .catch((error: Error) => {
        console.error('Failed to connect to MongoDB:', error);
        // Return a dummy client for build process
        if (process.env.NODE_ENV === 'production') {
          return new MongoClient('mongodb://localhost:27017/test').connect();
        }
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect()
    .catch((error: Error) => {
      console.error('Failed to connect to MongoDB:', error);
      // Return a dummy client for build process
      if (process.env.NODE_ENV === 'production') {
        return new MongoClient('mongodb://localhost:27017/test').connect();
      }
      throw error;
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise };