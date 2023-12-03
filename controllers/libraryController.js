const Library = require('../models/Library');
const Goal = require('../models/Goal');

/**
 * Adds a new resource to a goal's library.
 * 
 * This function handles the addition of a new resource to a specific goal's library.
 * It checks if the goal exists, then adds the resource to the goal's associated library.
 * If the library for the goal does not exist, it creates a new library document.
 * 
 * @param {Object} req - The request object, containing resource details and goal ID.
 * @param {Object} res - The response object for sending back the updated library.
 */
exports.addResource = async (req, res) => {
    try {
        const { goalId } = req.params;
        const newResource = req.body;

        // Check if the goal exists
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).send('Goal not found');
        }

        // Check if library for this goal exists or create a new one
        let library = await Library.findOne({ goalId: goal._id });
        if (!library) {
            library = new Library({ goalId: goal._id, resources: [] });
        }

        // Add new resource to the library
        library.resources.push(newResource);
        await library.save();

        res.status(201).json(library);
    } catch (error) {
        res.status(500).send('Error adding resource to library');
    }
};


/**
 * Retrieves all resources associated with a specific goal.
 * 
 * This function fetches the library document associated with the given goal,
 * identified by the goal ID provided in the URL parameter, and returns all 
 * resources within that library.
 * 
 * @param {Object} req - The request object, containing the goal's ID.
 * @param {Object} res - The response object for sending back the resources.
 */
exports.getAllResources = async (req, res) => {
    try {
        const { goalId } = req.params;

        // Check if the goal exists
        const goalExists = await Goal.exists({ _id: goalId });
        if (!goalExists) {
            return res.status(404).send('Goal not found');
        }

        // Find the library associated with the goal
        const library = await Library.findOne({ goalId });
        if (!library) {
            return res.status(404).send('No resources found for this goal');
        }

        res.status(200).json(library.resources);
    } catch (error) {
        res.status(500).send('Error retrieving resources');
    }
};


/**
 * Retrieves a single resource from a goal's library.
 * 
 * This function fetches a specific resource by its ID from the library associated with a goal.
 * It first verifies that the goal exists and then retrieves the resource from the library.
 * The goal ID and resource ID are provided in the URL parameters.
 * 
 * @param {Object} req - The request object, containing the goal's and resource's IDs.
 * @param {Object} res - The response object for sending back the resource.
 */
exports.getResource = async (req, res) => {
    try {
        const { goalId, resourceId } = req.params;

        // Check if the goal exists
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).send('Goal not found');
        }

        // Find the library associated with the goal
        const library = await Library.findOne({ goalId });
        if (!library) {
            return res.status(404).send('Library for goal not found');
        }

        // Find the specific resource in the library
        const resource = library.resources.find(r => r._id.toString() === resourceId);
        if (!resource) {
            return res.status(404).send('Resource not found');
        }
console.log(resource);
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).send('Error retrieving resource');
    }
};


/**
 * Updates a specific resource in a goal's library.
 * 
 * This function allows updating details of an existing resource within the library
 * associated with a specific goal. It first checks if the goal exists and then updates
 * the resource in the library. The goal ID and resource ID are provided in the URL parameters,
 * and the updated data is taken from the request body.
 * 
 * @param {Object} req - The request object, containing the updated resource data.
 * @param {Object} res - The response object for sending back the updated resource.
 */
exports.updateResource = async (req, res) => {
    try {
        const { goalId, resourceId } = req.params;
        const updatedData = req.body;

        // Check if the goal exists
        const goalExists = await Goal.exists({ _id: goalId });
        if (!goalExists) {
            return res.status(404).send('Goal not found');
        }

        // Find the library associated with the goal
        const library = await Library.findOne({ goalId });
        if (!library) {
            return res.status(404).send('Library not found for this goal');
        }

        // Find the specific resource in the library
        const resource = library.resources.id(resourceId);
        if (!resource) {
            return res.status(404).send('Resource not found');
        }

        // Update the fields of the resource
        Object.keys(updatedData).forEach(key => {
            resource[key] = updatedData[key];
        });

        await library.save();

        res.status(200).json(resource);
    } catch (error) {
        res.status(500).send('Error updating resource');
    }
};


/**
 * Deletes a resource from a goal's library.
 * 
 * This function handles the deletion of a resource from the library associated
 * with a specific goal. It first checks if the goal exists and then deletes
 * the resource from the library. The goal ID and resource ID are provided in
 * the URL parameters.
 * 
 * @param {Object} req - The request object, containing the goal's and resource's IDs.
 * @param {Object} res - The response object for confirming the deletion.
 */
exports.deleteResource = async (req, res) => {
    try {
        const { goalId, resourceId } = req.params;

        // Check if the goal exists
        const goalExists = await Goal.exists({ _id: goalId });
        if (!goalExists) {
            return res.status(404).send('Goal not found');
        }

        // Find the library associated with the goal
        const library = await Library.findOne({ goalId });
        if (!library) {
            return res.status(404).send('Library not found for this goal');
        }

        // Find and remove the specific resource
        const resourceIndex = library.resources.findIndex(r => r._id.toString() === resourceId);
        if (resourceIndex === -1) {
            return res.status(404).send('Resource not found');
        }

        library.resources.splice(resourceIndex, 1);
        await library.save();

        res.status(200).send({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting resource');
    }
};