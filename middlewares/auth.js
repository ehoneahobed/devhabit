const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to verify user tokens.
 *
 * This middleware checks the provided JWT token in the Authorization header.
 * If the token is valid, the user's information is attached to the request object.
 * If the token is invalid or not provided, the request is denied.
 */
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the token is in user's list of tokens
        const tokenExists = user.tokens.some(tokenObj => tokenObj.token === token);
        if (!tokenExists) {
            throw new Error('Token not active');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
