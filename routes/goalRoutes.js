const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middlewares/auth');

// Create a new goal
router.post('/', authMiddleware, goalController.createGoal);

// Retrieve all goals for the logged-in user
router.get('/', authMiddleware, goalController.getAllGoals);

// Retrieve a specific goal by ID
router.get('/:goalId', authMiddleware, goalController.getGoalById);

// Update a specific goal
router.put('/:goalId', authMiddleware, goalController.updateGoal);

// Delete a specific goal
router.delete('/:goalId', authMiddleware, goalController.deleteGoal);

module.exports = router;
