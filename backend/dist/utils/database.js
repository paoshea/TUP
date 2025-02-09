"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.getConnection = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
/**
 * Connect to MongoDB database
 */
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongodb.uri, config_1.config.mongodb.options);
        // Log successful connection
        mongoose_1.default.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        // Log connection errors
        mongoose_1.default.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        // Log disconnection
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose_1.default.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            }
            catch (error) {
                console.error('Error closing MongoDB connection:', error);
                process.exit(1);
            }
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
/**
 * Get the current database connection
 */
const getConnection = () => {
    return mongoose_1.default.connection;
};
exports.getConnection = getConnection;
/**
 * Close the database connection
 */
const closeConnection = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB connection closed');
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
};
exports.closeConnection = closeConnection;
