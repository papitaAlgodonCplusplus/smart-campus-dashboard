import mongoose from 'mongoose';

interface ISpace {
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy?: number;
  lastUpdated?: Date;
  position?: [number, number]; // [longitude, latitude]
}

const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  position: { type: [Number], index: '2dsphere' }
});

const Space = mongoose.model<ISpace>('Space', spaceSchema);

export default Space;