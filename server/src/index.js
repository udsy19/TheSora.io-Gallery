const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Import route files and handle potential missing files
let userRoutes, authRoutes, galleryRoutes, analyticsRoutes;

try {
  userRoutes = require('./routes/userRoutes');
} catch (error) {
  console.warn('userRoutes not found:', error.message);
  userRoutes = express.Router();
}

try {
  authRoutes = require('./routes/authRoutes');
} catch (error) {
  console.warn('authRoutes not found:', error.message);
  authRoutes = express.Router();
}

try {
  galleryRoutes = require('./routes/galleryRoutes');
} catch (error) {
  console.warn('galleryRoutes not found:', error.message);
  galleryRoutes = express.Router();
}

try {
  analyticsRoutes = require('./routes/analyticsRoutes');
} catch (error) {
  console.warn('analyticsRoutes not found:', error.message);
  analyticsRoutes = express.Router();
}

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Public route for testing auth
app.post('/api/auth/test-login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login attempt:', { username, password });
  
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      token: 'test-token-123',
      user: {
        id: '1',
        username: 'admin',
        role: 'admin'
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static files
app.use(express.static('public'));

// Connect to MongoDB and start server
mongoose.connect(config.MONGO_URI)
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });