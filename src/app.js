const express = require('express');
const cors = require('cors');
const parkingRoutes = require('./routes/parking-routes');
const authRoutes = require('./routes/auth-routes');
const { errorHandler } = require('./utils/error-handler');
const rateLimit = require('express-rate-limit');
const app = express();

// Rate Limiter: limit each IP to 100 requests per windowMs (15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded the number of allowed requests. Please try again later.',
    },
    headers: true, // Send back the rate limit info in the `RateLimit-*` headers
});


// Apply rate limiting to all requests
app.use(limiter);
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
