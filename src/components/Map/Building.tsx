// Building interface
interface Building {
  id: number;
  name: string;
  position: [number, number];
  info: string;
  capacity: number;
  currentOccupancy: number;
  openHours: string;
  peakHours: string;
  rules: string;
  services: string[];
  height?: number; // Building height in 3D space
  width?: number;  // Building width in 3D space
  depth?: number;  // Building depth in 3D space
  color?: string;  // Building color
}

export default Building;