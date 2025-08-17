const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Internal server error' });
});

// Import routes
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const userRoutes = require('./routes/users');
const statsRoutes = require("./routes/stats");
const ownerRoutes = require("./routes/owner");


app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use("/api/stats", statsRoutes)
app.use("/api/owner", ownerRoutes);




process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
});

// Database connection 
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ force: false }); 
    console.log('Database linked successfully.');
    
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
    });
    
    // shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down...');
      server.close(() => {
        console.log('Server closed');
        sequelize.close();
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        sequelize.close();
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Stack:', error.stack);
    // retry connection after delay
    setTimeout(startServer, 5000);
  }
};

startServer();