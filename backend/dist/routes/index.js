"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const animals_1 = __importDefault(require("./animals"));
const evaluations_1 = __importDefault(require("./evaluations"));
const shows_1 = __importDefault(require("./shows"));
const sync_1 = __importDefault(require("./sync"));
const notifications_1 = __importDefault(require("./notifications"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Apply request logging to all routes
router.use(middleware_1.requestLogger);
// Mount routes
router.use('/auth', auth_1.default);
router.use('/animals', animals_1.default);
router.use('/evaluations', evaluations_1.default);
router.use('/shows', shows_1.default);
router.use('/sync', sync_1.default);
router.use('/notifications', notifications_1.default);
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
