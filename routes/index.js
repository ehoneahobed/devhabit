// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const goalRoutes = require('./goalRoutes');
const libraryRoutes = require('./libraryRoutes');
// Import other route files here as needed

// Use the individual route modules
router.use('/users', userRoutes);
router.use('/goals', goalRoutes);
router.use('/libraries', libraryRoutes);

module.exports = router;
