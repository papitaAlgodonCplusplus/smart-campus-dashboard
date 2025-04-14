import mongoose from 'mongoose';

interface ISpace {
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: Date;
}

const spaceSchema = new mongoose.Schema<ISpace>({
  name: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Space = mongoose.model<ISpace>('Space', spaceSchema);

export default Space;