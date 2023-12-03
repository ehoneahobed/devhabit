const Goal = require('../models/Goal');

// Utility function to filter metrics based on the category
function filterMetricsByCategory(category, metrics) {
    const metricTypes = {
        'Learning Language': ['Hours to Dedicate', 'Key Concepts'],
        'Project Development': ['Milestones', 'Code Commits'],
        'Algorithm Mastery': ['Core Algorithms', 'Weekly Problem Goals']
    };

    return metrics.filter(metric => metricTypes[category].includes(metric.type));
}

/**
 * Creates a new goal.
 * 
 * This function handles the creation of a new goal. It takes goal details from
 * the request body and saves them to the database. Returns the created goal details.
 * 
 * @param {Object} req - The request object, containing goal details.
 * @param {Object} res - The response object for sending back the created goal.
 */
exports.createGoal = async (req, res) => {
    try {
        const { category, metrics, ...rest } = req.body;
        const filteredMetrics = filterMetricsByCategory(category, metrics);

        const goal = new Goal({ ...rest, userId: req.user._id, category, metrics: filteredMetrics });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).send('Error creating the goal');
    }
};

/**
 * Retrieves all goals for a user.
 * 
 * Fetches and returns all goals associated with the logged-in user. The goals
 * are retrieved from the database based on the user's ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object for sending back the goals.
 */
exports.getAllGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).send('Error retrieving goals');
    }
};


/**
 * Retrieves a single goal by its ID.
 * 
 * Fetches and returns a specific goal based on its ID, provided the goal
 * belongs to the logged-in user.
 * 
 * @param {Object} req - The request object, containing the goal's ID.
 * @param {Object} res - The response object for sending back the goal.
 */
exports.getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.goalId, userId: req.user._id });
        if (!goal) {
            return res.status(404).send('Goal not found');
        }
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).send('Error retrieving the goal');
    }
};

/**
 * Updates an existing goal.
 * 
 * Allows users to update details of an existing goal. Only the goal's owner
 * can update it. The function updates the goal in the database and returns
 * the updated goal information.
 * 
 * @param {Object} req - The request object, containing updated goal details.
 * @param {Object} res - The response object for sending back the updated goal.
 */
exports.updateGoal = async (req, res) => {
    try {
        const { category, metrics, ...rest } = req.body;
        let goalUpdateData = { ...rest };

        const goal = await Goal.findById(req.params.goalId);
        if (!goal) {
            return res.status(404).send('Goal not found');
        }

        // Check if category is being updated or if metrics are provided
        if (category || metrics) {
            // If category is changed or not provided (use existing goal category), filter metrics
            const updatedCategory = category || goal.category;
            const filteredMetrics = filterMetricsByCategory(updatedCategory, metrics || goal.metrics);

            goalUpdateData = { ...goalUpdateData, category: updatedCategory, metrics: filteredMetrics };
        }

        // Update the goal with new data
        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.goalId,
            goalUpdateData,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).send('Error updating the goal');
    }
};

/**
 * Deletes an existing goal.
 * 
 * Removes a goal from the database. Only the goal's owner can delete it.
 * This function handles the deletion and returns a success message upon completion.
 * 
 * @param {Object} req - The request object, containing the goal's ID.
 * @param {Object} res - The response object for confirming the deletion.
 */
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.goalId, userId: req.user._id });
        if (!goal) {
            return res.status(404).send('Goal not found');
        }
        res.status(200).send({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting the goal');
    }
};


