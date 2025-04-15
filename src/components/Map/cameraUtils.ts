import * as THREE from 'three';

/**
 * Smoothly moves the camera to focus on a specific building
 * @param camera - THREE.js camera
 * @param controls - OrbitControls
 * @param targetPosition - Position to move the camera to
 * @param duration - Duration of animation in milliseconds
 */
export const focusOnBuilding = (
  camera: THREE.Camera,
  controls: any,
  targetPosition: [number, number, number],
  duration: number = 1000
): void => {
  // Calculate target position (slightly offset from the building)
  const target = new THREE.Vector3(
    targetPosition[0],
    targetPosition[1] + 2, // Above the building
    targetPosition[2] + 10 // In front of the building
  );
  
  // Get current camera position
  const startPosition = camera.position.clone();
  
  // Calculate the distance for a nice viewing angle
  const endPosition = new THREE.Vector3(
    targetPosition[0] + 5,
    targetPosition[1] + 5,
    targetPosition[2] + 15
  );
  
  // Animate camera movement
  const startTime = performance.now();
  
  const updateCamera = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smoother motion
    const easeProgress = easeOutCubic(progress);
    
    // Interpolate camera position
    camera.position.lerpVectors(startPosition, endPosition, easeProgress);
    
    // Update controls target
    controls.target.set(target.x, target.y, target.z);
    controls.update();
    
    // Continue animation until complete
    if (progress < 1) {
      requestAnimationFrame(updateCamera);
    }
  };
  
  updateCamera();
};

/**
 * Creates a fly-through animation showing all buildings
 * @param camera - THREE.js camera
 * @param controls - OrbitControls
 * @param buildings - Array of buildings with positions
 * @param durationPerBuilding - Duration to spend at each building in milliseconds
 */
export const tourCampus = (
  camera: THREE.Camera,
  controls: any,
  buildings: Array<{ position: [number, number]; id: number }>,
  durationPerBuilding: number = 3000
): void => {
  let currentIndex = 0;
  
  const visitNextBuilding = () => {
    if (currentIndex >= buildings.length) {
      // End of tour, reset to overview position
      focusOnBuilding(
        camera,
        controls,
        [0, 0, 0],
        1500
      );
      return;
    }
    
    const building = buildings[currentIndex];
    const scaledPosition: [number, number, number] = [
      (building.position[1] - -84.05) * 500,
      5,
      (building.position[0] - 9.94) * 500
    ];
    
    // Focus on this building
    focusOnBuilding(camera, controls, scaledPosition, 1000);
    
    // Move to next building after delay
    currentIndex++;
    setTimeout(visitNextBuilding, durationPerBuilding);
  };
  
  // Start the tour
  visitNextBuilding();
};

// Easing function for smoother animation
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

// Helper to create random variations in building appearance
export const getRandomBuildingProps = (buildingType: string): { 
  height: number; 
  width: number; 
  depth: number;
  stories: number;
  windows: boolean;
  color: string;
} => {
  // Base properties by building type
  const baseProps: any = {
    'library': { height: 4, width: 6, depth: 6, stories: 4, windows: true, color: '#004488' },
    'academic': { height: 3.5, width: 5, depth: 5, stories: 3, windows: true, color: '#006699' },
    'cafeteria': { height: 2, width: 7, depth: 5, stories: 1, windows: true, color: '#226644' },
    'admin': { height: 3, width: 4, depth: 4, stories: 2, windows: true, color: '#664422' },
    'dorm': { height: 5, width: 3, depth: 8, stories: 5, windows: true, color: '#884422' },
    'sports': { height: 3, width: 10, depth: 20, stories: 1, windows: false, color: '#228844' },
    'default': { height: 3, width: 5, depth: 5, stories: 2, windows: true, color: '#445566' }
  };
  
  // Get base properties for the building type, or use default
  const base = baseProps[buildingType] || baseProps.default;
  
  // Add random variations
  return {
    height: base.height + (Math.random() * 1 - 0.5),
    width: base.width + (Math.random() * 2 - 1),
    depth: base.depth + (Math.random() * 2 - 1),
    stories: base.stories,
    windows: base.windows,
    color: base.color
  };
};