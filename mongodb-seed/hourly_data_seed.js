// MongoDB seed script for hourly occupancy data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define HourlyData schema
const hourlyDataSchema = new mongoose.Schema({
  hour: { type: String, required: true },
  date: { type: Date, default: Date.now },
  spaceData: { type: Map, of: Number }
});

const HourlyData = mongoose.model('HourlyData', hourlyDataSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected...');
  seedHourlyData();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Generate realistic hourly data for each space
async function seedHourlyData() {
  try {
    // First, clear existing hourly data
    await HourlyData.deleteMany({});
    console.log('Cleared existing hourly data');

    // Get all spaces from the database to use their IDs and names
    const Space = mongoose.model('Space', new mongoose.Schema({
      name: String,
      building: String,
      capacity: Number
    }));
    
    const spaces = await Space.find({});
    console.log(`Found ${spaces.length} spaces`);

    if (spaces.length === 0) {
      console.error('No spaces found in the database. Please seed spaces first.');
      process.exit(1);
    }

    // Define hours
    const hours = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'];
    
    // Generate data for the last 7 days
    const today = new Date();
    const hourlyData = [];

    for (let day = 6; day >= 0; day--) {
      const date = new Date();
      date.setDate(today.getDate() - day);
      date.setHours(0, 0, 0, 0); // Set to beginning of day

      console.log(`Generating data for ${date.toDateString()}`);

      for (const hour of hours) {
        const hourNum = parseInt(hour.replace('AM', '').replace('PM', ''));
        const isPM = hour.includes('PM') && hourNum !== 12;
        const is12AM = hour.includes('AM') && hourNum === 12;
        let hourInDay = is12AM ? 0 : isPM ? hourNum + 12 : hourNum;
        
        // Create date object for this specific hour
        const hourDate = new Date(date);
        hourDate.setHours(hourInDay, 0, 0, 0);

        // Determine day type (weekday or weekend)
        const isWeekend = hourDate.getDay() === 0 || hourDate.getDay() === 6;
        
        // Create spaceData map with occupancy percentage for each space
        const spaceData = new Map();
        
        spaces.forEach(space => {
          const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');
          
          // Generate percentage based on patterns:
          
          // Base value depends on time of day
          let basePercentage = 0;
          
          // Different patterns for weekdays vs weekends
          if (isWeekend) {
            // Weekends have lower occupancy overall
            if (hour.includes('AM')) {
              basePercentage = hourNum * 3; // Slower morning increase
            } else if (hour === '12PM') {
              basePercentage = 40; // Lunch peak, but lower than weekdays
            } else {
              basePercentage = 35 - ((hourNum) * 4); // Quicker afternoon decline
            }
          } else {
            // Weekday pattern
            if (hour.includes('AM')) {
              basePercentage = hourNum * 8; // Morning increase
            } else if (hour === '12PM') {
              basePercentage = 80; // Lunch peak
            } else if (hourNum <= 6) {
              basePercentage = 75 - ((hourNum - 1) * 5); // Afternoon decline
            } else {
              basePercentage = 45 - ((hourNum - 6) * 8); // Evening sharp decline
            }
          }
          
          // Building-specific adjustments
          if (space.building.includes('Soda') || space.building.includes('Comedor')) {
            // Food areas are busier at meal times
            if (hour === '12PM' || hour === '1PM') {
              basePercentage += 20;
            } else if (hour === '6PM' || hour === '7PM') {
              basePercentage += 15;
            }
          } else if (space.building.includes('Biblioteca')) {
            // Libraries get busier in the afternoon and evening
            if (hourNum >= 3 && hourNum <= 8) {
              basePercentage += 15;
            }
          } else if (space.building.includes('Administrativo')) {
            // Admin buildings empty after work hours
            if (hourNum >= 5) {
              basePercentage = Math.max(5, basePercentage - 30);
            }
          }
          
          // Add some randomness for realism
          const randomFactor = Math.random() * 20 - 10;
          
          // Ensure percentage is between 0 and 100
          const percentage = Math.min(100, Math.max(0, Math.round(basePercentage + randomFactor)));
          
          // Store percentage
          spaceData.set(spaceKey, percentage);
        });
        
        // Create HourlyData document
        hourlyData.push({
          hour,
          date: hourDate,
          spaceData
        });
      }
    }
    
    // Insert all hourly data
    await HourlyData.insertMany(hourlyData);
    console.log(`Successfully inserted ${hourlyData.length} hourly data records`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error seeding hourly data:', error);
    process.exit(1);
  }
}