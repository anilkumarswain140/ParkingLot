const express = require('express');
const { park, getSlot, unpark } = require('../controllers/parkingController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all parking routes
router.use(authMiddleware);

// Park a car
router.post('/park', park);

// Get slot information
router.get('/slot/:slot', getSlot);

// Unpark a car
router.post('/unpark', unpark);

module.exports = router;
