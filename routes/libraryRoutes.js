const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const authMiddleware = require('../middlewares/auth');

// Add resource to library
router.post('/:goalId/resources', authMiddleware, libraryController.addResource);

// Get all resources in library
router.get('/:goalId/resources', authMiddleware, libraryController.getAllResources);

// Get a single resource in library
router.get('/:goalId/resources/:resourceId', authMiddleware, libraryController.getResource);

// Update a resource in library
router.put('/:goalId/resources/:resourceId', authMiddleware, libraryController.updateResource);

// Delete a resource from library
router.delete('/:goalId/resources/:resourceId', authMiddleware, libraryController.deleteResource);

module.exports = router;
