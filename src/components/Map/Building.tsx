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
  height: number;
  width: number;
  depth: number;
}

export default Building;