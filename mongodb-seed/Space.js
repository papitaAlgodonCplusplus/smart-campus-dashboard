import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  position: { type: [Number], index: '2dsphere' },
  
  // Additional fields for 3D map view
  info: { type: String },
  openHours: { type: String },
  peakHours: { type: String },
  rules: { type: String },
  services: { type: [String] },
  height: { type: Number },
  width: { type: Number },
  depth: { type: Number }
});

const Space = mongoose.model('Space', spaceSchema);

export default Space;
