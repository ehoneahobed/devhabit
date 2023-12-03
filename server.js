const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes'); // Importing the routes from the routes directory

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use consolidated routes
app.use('/api/v1', routes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the devHabit API!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URI).then(() => {
      app.listen(process.env.PORT || 5000, () => {
          console.log(`Database connected and Backend server is running successfully on port ${process.env.PORT}`);
      })
  }).catch((error) => {
      console.log(error);
  })


