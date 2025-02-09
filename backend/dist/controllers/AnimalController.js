"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimalStats = exports.searchAnimals = exports.deleteAnimal = exports.updateAnimal = exports.getAnimal = exports.getAnimals = exports.createAnimal = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.createAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const animal = await services_1.animalService.createAnimal(req.body, userId);
    res.status(201).json({ success: true, data: animal });
});
exports.getAnimals = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const animals = await services_1.animalService.getUserAnimals(userId, req.query);
    res.json({ success: true, data: animals });
});
exports.getAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const animalId = req.params.id;
    const animal = await services_1.animalService.getAnimalById(animalId, userId);
    if (!animal) {
        throw new apiResponse_1.ApiError(404, 'NOT_FOUND', 'Animal not found');
    }
    res.json({ success: true, data: animal });
});
exports.updateAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const animalId = req.params.id;
    const animal = await services_1.animalService.updateAnimal(animalId, userId, req.body);
    res.json({ success: true, data: animal });
});
exports.deleteAnimal = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const animalId = req.params.id;
    await services_1.animalService.deleteAnimal(animalId, userId);
    res.json({ success: true, message: 'Animal deleted successfully' });
});
exports.searchAnimals = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const animals = await services_1.animalService.searchAnimals(req.query);
    res.json({ success: true, data: animals });
});
exports.getAnimalStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const stats = await services_1.animalService.getAnimalStats(userId);
    res.json({ success: true, data: stats });
});
