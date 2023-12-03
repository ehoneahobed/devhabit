// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Add other necessary imports and initialization code here


/**
 * Registers a new user in the application.
 * 
 * This function handles new user registrations. It takes the user's
 * username, email, and password, checks if the user already exists,
 * hashes the password, and then stores the user in the database.
 * 
 * @param {Object} req - The request object from Express.js containing user data.
 * @param {Object} res - The response object from Express.js for sending responses.
 */
exports.register = async (req, res) => {
    try {
      const { username, email, fullname, password } = req.body;
  
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).send('User already exists');
      }
  
      // Create a new user and hash the password
      const user = new User({ username, email, fullname, password });
      await user.save();
  
      res.status(201).send({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
      res.status(500).send('Error registering new user');
    }
  };
  

  /**
 * User login function.
 * 
 * This function verifies user credentials against the database. If the
 * credentials are correct, it generates and returns a JSON Web Token (JWT)
 * for authenticating subsequent requests.
 * 
 * @param {Object} req - The request object containing login credentials.
 * @param {Object} res - The response object for sending back the JWT.
 */
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
        
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
      }
      
      // Generate a token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      user.tokens = user.tokens.concat({ token });
      await user.save();

      res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user', error});
    }
  };
  

/**
 * Updates user details.
 * 
 * This function allows users to update their account details such as username,
 * email, and password. It handles the request to update user information in the
 * database and returns the updated information.
 * 
 * @param {Object} req - The request object, containing the updated user data.
 * @param {Object} res - The response object for sending back the updated user data.
 */
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;  // Assuming user ID is passed as a URL parameter
        const updates = req.body;

        // Optionally, hash the password if it's being updated.
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 8);
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).send('Error updating user');
    }
};

/**
 * Deletes a user account.
 * 
 * This function handles the deletion of a user account from the database. It
 * should be used with caution and typically includes security checks to confirm
 * the user's identity before proceeding with the deletion.
 * 
 * @param {Object} req - The request object, usually containing the user's ID.
 * @param {Object} res - The response object for confirming the deletion.
 */
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;  // Assuming user ID is passed as a URL parameter

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
};


// controllers/userController.js

/**
 * Logs out a user.
 * 
 * This function handles the user logout by removing the provided token from
 * the user's list of tokens in the database. It effectively ends the session
 * associated with that token. It assumes that the current token is attached
 * to the request object (req.token) by the authentication middleware.
 * 
 * @param {Object} req - The request object, containing the user's token.
 * @param {Object} res - The response object for sending back the logout confirmation.
 */
exports.logout = async (req, res) => {
    try {
        // Remove the token from the user's tokens array
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token);
        await req.user.save();

        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send('Error during logout');
    }
};


/**
 * Logs out a user from all sessions.
 * 
 * This function handles logging out a user from all sessions by clearing the
 * tokens array in the user's record in the database. This action effectively
 * ends all sessions across all devices where the user might be logged in.
 * 
 * @param {Object} req - The request object, containing the user's information.
 * @param {Object} res - The response object for sending back the logout confirmation.
 */
exports.logoutAll = async (req, res) => {
    try {
        req.user.tokens = []; // Clear all tokens
        await req.user.save();

        res.send({ message: 'Logged out from all sessions successfully' });
    } catch (error) {
        res.status(500).send('Error during logout from all sessions');
    }
};
