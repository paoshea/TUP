import { MongoClient } from 'mongodb';

// In development, use a local MongoDB instance if no URI is provided
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/livestock';
const options = {};

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
      .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(error => {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise };