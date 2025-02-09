"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const database_1 = require("./utils/database");
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Request parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Compression and logging
app.use((0, compression_1.default)());
if (config_1.config.env !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// API routes
app.use('/api', routes_1.default);
// Error handling
app.use(middleware_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        // Connect to database
        await (0, database_1.connectDatabase)();
        console.log('Connected to database');
        // Start listening
        const port = config_1.config.port;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`Environment: ${config_1.config.env}`);
            console.log(`MongoDB URI: ${config_1.config.mongodb.uri}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});
// Start application
if (require.main === module) {
    startServer();
}
exports.default = app;
