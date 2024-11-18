require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Importing route files
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://192.168.98.20:5173'], // Your frontend URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Update your CORS configuration in server.js
app.use(helmet());
// Add helmet configuration to allow cross-origin
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'http://192.168.98.20:5173'];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Increase maximum age to 10 minutes
}));
// Add this middleware before your routes
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log('Incoming Request Body:', req.body);
//   next();
// });
// Routes
app.use('/api/admin', adminRoutes);
// Uncomment this line when you are ready to use bookRoutes
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

// Database connection and server start
const sequelize = require('./config/db');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      // Option 1: Use alter (modifies the schema, no data loss)
      await sequelize.sync({ alter: true });
      // Option 2: (For complete reset) Use force (will drop and recreate tables)
      // await sequelize.sync({ force: true });
      console.log('Database synced');
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
