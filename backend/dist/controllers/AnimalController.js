"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.searchAnimals = exports.deleteAnimal = exports.updateAnimal = exports.getAnimal = exports.getAnimals = exports.createAnimal = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const ownerId = req.user.id;
    const animal = await services_1.animalService.createAnimal(req.body, ownerId);
    res.status(201).json({ success: true, data: animal });
});
exports.getAnimals = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const animals = await services_1.animalService.getUserAnimals(userId);
    res.json({ success: true, data: animals });
});
exports.getAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { animalId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const animal = await services_1.animalService.getAnimalById(animalId, userId, isAdmin);
    res.json({ success: true, data: animal });
});
exports.updateAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { animalId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const animal = await services_1.animalService.updateAnimal(animalId, userId, req.body, isAdmin);
    res.json({ success: true, data: animal });
});
exports.deleteAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { animalId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    await services_1.animalService.deleteAnimal(animalId, userId, isAdmin);
    res.json({ success: true, message: 'Animal deleted successfully' });
});
exports.searchAnimals = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { breed, category, region } = req.query;
    const animals = await services_1.animalService.searchAnimals({ breed, category, region });
    res.json({ success: true, data: animals });
});
exports.getStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const stats = await services_1.animalService.getAnimalStats(userId);
    res.json({ success: true, data: stats });
});
