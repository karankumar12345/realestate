import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONG)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT; // Use PORT from .env or fallback to 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Serve static files for your frontend
app.use(express.static(path.join(__dirname, '/client/dist')));

// Handle client-side routing for single-page apps
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
