import spaceRoutes from '/opt/render/project/src/api/src/routes/spaceRoutes.js';
import hourlyDataRoutes from '/opt/render/project/src/api/src/routes/hourlyDataRoutes.js';
import reservationRoutes from '/opt/render/project/src/api/src/routes/reservationRoutes.js';
import authRoutes from '/opt/render/project/src/api/src/routes/authRoutes.js';
// import spaceRoutes from './routes/spaceRoutes.js';
// import hourlyDataRoutes from './routes/hourlyDataRoutes.js';
// import reservationRoutes from './routes/reservationRoutes.js';
// import authRoutes from './routes/authRoutes.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-campus';

// Middleware
app.use(cors({
  origin: ['https://smart-campus-dashboard-1.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/spaces', spaceRoutes);
app.use('/api/hourly-data', hourlyDataRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Smart Campus API is running');
})

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});