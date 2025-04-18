import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db';
import spaceRoutes from './routes/spaceRoutes';
import hourlyDataRoutes from './routes/hourlyDataRoutes';
import reservationRoutes from './routes/reservationRoutes';
import mongoose from 'mongoose';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-campus';

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/hourly-data', hourlyDataRoutes);
app.use('/api/reservations', reservationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Smart Campus API is running');
})

mongoose.connect(MONGODB_URI).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});