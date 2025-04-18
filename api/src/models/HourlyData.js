import mongoose from 'mongoose';

const hourlyDataSchema = new mongoose.Schema({
  hour: { type: String, required: true },
  date: { type: Date, default: Date.now },
  spaceData: { type: Map, of: Number }
});

// Index for efficient querying
hourlyDataSchema.index({ date: -1, hour: 1 });

export default mongoose.model('HourlyData', hourlyDataSchema);
