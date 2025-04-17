import mongoose from 'mongoose';

interface IHourlyData {
  hour: string;
  date: Date;
  spaceData: Map<string, number>;
}

const hourlyDataSchema = new mongoose.Schema({
  hour: { type: String, required: true },
  date: { type: Date, default: Date.now },
  spaceData: { type: Map, of: Number }
});

// Index for efficient querying
hourlyDataSchema.index({ date: -1, hour: 1 });

const HourlyData = mongoose.model<IHourlyData>('HourlyData', hourlyDataSchema);

export default HourlyData;