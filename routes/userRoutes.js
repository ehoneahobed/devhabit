const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// User update route
router.put('/update/:userId', userController.updateUser);

// User deletion route
router.delete('/delete/:userId', userController.deleteUser);

// Logout route
router.post('/logout', authMiddleware, userController.logout);

// Logout from all sessions route
router.post('/logoutAll', authMiddleware, userController.logoutAll);


module.exports = router;
