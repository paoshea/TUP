import mongoose from 'mongoose';
import { config } from '../config';

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);

    // Log successful connection
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    // Log connection errors
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    // Log disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Get the current database connection
 */
export const getConnection = (): mongoose.Connection => {
  return mongoose.connection;
};

/**
 * Close the database connection
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};