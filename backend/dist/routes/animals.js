"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(middleware_1.authenticate);
// Create a new animal
router.post('/', controllers_1.animalController.createAnimal);
// Get all animals for the authenticated user
router.get('/', controllers_1.animalController.getAnimals);
// Get a specific animal
router.get('/:animalId', controllers_1.animalController.getAnimal);
// Update an animal
router.put('/:animalId', controllers_1.animalController.updateAnimal);
// Delete an animal
router.delete('/:animalId', controllers_1.animalController.deleteAnimal);
// Search animals
router.get('/search', controllers_1.animalController.searchAnimals);
// Get animal statistics
router.get('/stats', controllers_1.animalController.getStats);
exports.default = router;
