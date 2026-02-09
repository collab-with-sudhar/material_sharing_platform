import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorMiddleware from './middlewares/error.js';

// Handle Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Configure helmet for security while allowing Google OAuth
app.use(helmet({
  crossOriginOpenerPolicy: false, // Disable COOP to allow Google OAuth popup
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://accounts.google.com", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://accounts.google.com", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

// Routes
import materialRoutes from './routes/materialRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { checkCompressionHealth, getCompressionStats } from './utils/compressionHealthCheck.js';
import { cleanupOldTempFiles } from './utils/pdfCompression.js';

app.use('/api/materials', materialRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const compressionHealth = await checkCompressionHealth();
  const compressionStats = getCompressionStats();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      compression: compressionHealth
    },
    compressionStats
  });
});

// Root
app.get('/', (req, res) => res.send('TCE Materials Backend API Running'));

// Periodic cleanup of old temp files (every 30 minutes)
setInterval(() => {
  console.log('[Cleanup] Running scheduled cleanup...');
  cleanupOldTempFiles();
}, 30 * 60 * 1000);

// Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`TCE Materials Backend Server running on port ${PORT}`));

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});