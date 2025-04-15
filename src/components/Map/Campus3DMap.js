import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Billboard, Sky, Cloud, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import MapControls from './MapControls';

// Enhanced Building component with windows
const Building = ({ building, onClick, isNightMode }) => {
  const meshRef = useRef();
  const windowsRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Calculate building dimensions
  const height = building.height || 2 + (building.capacity / 200);
  const width = building.width || 3 + Math.random() * 2;
  const depth = building.depth || 3 + Math.random() * 2;
  
  // Calculate number of floors based on height
  const floors = Math.max(1, Math.floor(height / 1.2));
  
  // Calculate number of windows per floor
  const windowsPerFloorWidth = Math.max(2, Math.floor(width / 1.5));
  const windowsPerFloorDepth = Math.max(2, Math.floor(depth / 1.5));

  // Calculate occupancy percentage
  const occupancyPercentage = (building.currentOccupancy / building.capacity) * 100;
  
  // Determine color based on occupancy
  let color;
  if (occupancyPercentage < 40) {
    color = '#0f8'; // Low occupancy - green
  } else if (occupancyPercentage < 70) {
    color = '#f80'; // Medium occupancy - orange
  } else {
    color = '#f08'; // High occupancy - red
  }

  // Base building color (various shades of blue/gray for different buildings)
  const baseColors = ['#0c4a6e', '#1e3a8a', '#1e293b', '#0f172a', '#134e4a', '#365314', '#4c1d95'];
  const buildingBaseColor = baseColors[building.id % baseColors.length];

  // Light effects for windows
  const windowLightEffect = isNightMode ? (Math.random() > 0.3 ? '#ffd700' : '#f8fafc') : 'black';
  const windowEmissive = isNightMode ? windowLightEffect : 'black';
  const windowEmissiveIntensity = isNightMode ? 0.6 : 0;

  // Animate on hover and windows lights
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.1, 0.1);
      } else {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      }
      
      // Add a subtle floating animation
      meshRef.current.position.y = height / 2 + Math.sin(Date.now() * 0.001 + building.id) * 0.05;
    }

    // Flicker some windows randomly in night mode
    if (windowsRef.current && isNightMode) {
      const materials = windowsRef.current.material;
      if (Array.isArray(materials)) {
        materials.forEach((material, index) => {
          // Randomly flicker some windows
          if (Math.random() < 0.001) {
            material.emissiveIntensity = Math.random() * 0.8;
          }
        });
      }
    }
  });

  // Scale position from Leaflet coordinates to 3D space
  const scaledPosition = [
    (building.position[1] - -84.05) * 10000, // X (longitude)
    height / 2.5, // Y (height)
    (building.position[0] - 9.94) * 10000 // Z (latitude)
  ];

  return (
    <group position={scaledPosition}>
      {/* Building base */}
      <mesh 
        ref={meshRef}
        onClick={() => onClick(building.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={hovered ? '#0ff' : buildingBaseColor} 
          emissive={hovered ? color : '#000'}
          emissiveIntensity={hovered ? 0.5 : 0}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>

      {/* Windows - create a grid of window instances */}
      <group ref={windowsRef}>
        {Array.from({ length: floors }).map((_, floorIndex) => (
          <React.Fragment key={`floor-${floorIndex}`}>
            {/* Windows on width sides */}
            {Array.from({ length: windowsPerFloorWidth }).map((_, windowIndex) => {
              const windowSize = 0.4;
              const windowPadding = 0.15;
              const windowWidth = width / windowsPerFloorWidth - windowPadding;
              const windowHeight = 0.7;
              const windowDepth = 0.05;
              const posX = -width/2 + (windowIndex + 0.5) * (width / windowsPerFloorWidth);
              const posY = -height/2 + (floorIndex + 0.5) * (height / floors);
              
              // Create windows on front side
              return (
                <React.Fragment key={`window-width-${floorIndex}-${windowIndex}`}>
                  <mesh
                    position={[posX, posY, depth/2 + 0.01]}
                    castShadow
                  >
                    <boxGeometry args={[windowWidth, windowHeight, windowDepth]} />
                    <meshStandardMaterial 
                      color={windowLightEffect}
                      transparent
                      opacity={0.8}
                      emissive={windowEmissive}
                      emissiveIntensity={windowEmissiveIntensity}
                      metalness={0.9}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Windows on back side */}
                  <mesh
                    position={[posX, posY, -depth/2 - 0.01]}
                    castShadow
                  >
                    <boxGeometry args={[windowWidth, windowHeight, windowDepth]} />
                    <meshStandardMaterial 
                      color={windowLightEffect}
                      transparent
                      opacity={0.8}
                      emissive={windowEmissive}
                      emissiveIntensity={windowEmissiveIntensity}
                      metalness={0.9}
                      roughness={0.2}
                    />
                  </mesh>
                </React.Fragment>
              );
            })}
            
            {/* Windows on depth sides */}
            {Array.from({ length: windowsPerFloorDepth }).map((_, windowIndex) => {
              const windowWidth = 0.4;
              const windowPadding = 0.15;
              const windowHeight = 0.7;
              const windowDepth = depth / windowsPerFloorDepth - windowPadding;
              const posZ = -depth/2 + (windowIndex + 0.5) * (depth / windowsPerFloorDepth);
              const posY = -height/2 + (floorIndex + 0.5) * (height / floors);
              
              return (
                <React.Fragment key={`window-depth-${floorIndex}-${windowIndex}`}>
                  {/* Windows on right side */}
                  <mesh
                    position={[width/2 + 0.01, posY, posZ]}
                    rotation={[0, Math.PI/2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[windowDepth, windowHeight, 0.05]} />
                    <meshStandardMaterial 
                      color={windowLightEffect}
                      transparent
                      opacity={0.8}
                      emissive={windowEmissive}
                      emissiveIntensity={windowEmissiveIntensity}
                      metalness={0.9}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Windows on left side */}
                  <mesh
                    position={[-width/2 - 0.01, posY, posZ]}
                    rotation={[0, Math.PI/2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[windowDepth, windowHeight, 0.05]} />
                    <meshStandardMaterial 
                      color={windowLightEffect}
                      transparent
                      opacity={0.8}
                      emissive={windowEmissive}
                      emissiveIntensity={windowEmissiveIntensity}
                      metalness={0.9}
                      roughness={0.2}
                    />
                  </mesh>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
      </group>

      {/* Building label */}
      <Billboard position={[0, height + 0.5, 0]} follow={true}>
        <Text
          color="#fff"
          fontSize={0.5}
          maxWidth={10}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {building.name}
        </Text>
      </Billboard>

      {/* Occupancy indicator */}
      <mesh position={[0, -height/2 - 0.1, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial 
          color="#000" 
          emissive="#000"
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh position={[(width * (occupancyPercentage/100 - 1))/2, -height/2 - 0.05, 0]}>
        <boxGeometry args={[width * (occupancyPercentage/100), 0.2, depth]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

// Tree component
const Tree = ({ position, scale = 1 }) => {
  const trunkRef = useRef();
  const leavesRef = useRef();
  
  // Different tree types
  const treeTypes = [
    { 
      trunkHeight: 1.2, 
      trunkRadius: 0.15, 
      leavesHeight: 2, 
      leavesRadius: 0.8, 
      leavesColor: '#2f6e31'
    },
    { 
      trunkHeight: 1.5, 
      trunkRadius: 0.2, 
      leavesHeight: 1.5, 
      leavesRadius: 1, 
      leavesColor: '#235c24'
    },
    { 
      trunkHeight: 0.8, 
      trunkRadius: 0.1, 
      leavesHeight: 1.2, 
      leavesRadius: 0.6, 
      leavesColor: '#386a3a'
    }
  ];
  
  // Randomly select a tree type
  const treeTypeIndex = Math.floor(position[0] * position[2]) % treeTypes.length;
  const treeType = treeTypes[Math.abs(treeTypeIndex)];
  
  useFrame(() => {
    if (leavesRef.current) {
      // Gentle swaying animation
      leavesRef.current.rotation.y += 0.001;
      leavesRef.current.position.y = treeType.trunkHeight + Math.sin(Date.now() * 0.001 + position[0]) * 0.02;
    }
  });
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tree trunk */}
      <mesh ref={trunkRef} castShadow position={[0, treeType.trunkHeight/2, 0]}>
        <cylinderGeometry args={[treeType.trunkRadius, treeType.trunkRadius * 1.2, treeType.trunkHeight, 8]} />
        <meshStandardMaterial color="#614b2a" roughness={0.9} />
      </mesh>
      
      {/* Tree leaves */}
      <mesh ref={leavesRef} castShadow position={[0, treeType.trunkHeight, 0]}>
        <coneGeometry args={[treeType.leavesRadius, treeType.leavesHeight, 8]} />
        <meshStandardMaterial color={treeType.leavesColor} roughness={0.8} />
      </mesh>
    </group>
  );
};

// Fountain component
const Fountain = ({ position }) => {
  const waterRef = useRef();
  const particlesRef = useRef();
  
  useFrame(() => {
    if (waterRef.current) {
      // Animate water surface
      waterRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.05 + 0.5;
    }
    
    // Animate water particles if we had them
    // For a full particle system we'd need to use a custom shader or particles system
  });
  
  return (
    <group position={position}>
      {/* Fountain base */}
      <mesh receiveShadow>
        <cylinderGeometry args={[2, 2.2, 0.5, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      
      {/* Fountain inner circle */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.1, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      
      {/* Water */}
      <mesh ref={waterRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 16]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          transparent
          opacity={0.7}
          metalness={0.3}
          roughness={0.2}
          emissive="#0ea5e9"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Fountain center piece */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      
      {/* Top water spout - simplified representation */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          transparent
          opacity={0.6}
          metalness={0.3}
          roughness={0.2}
          emissive="#0ea5e9"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

// Bench component
const Bench = ({ position, rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Bench seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 0.6]} />
        <meshStandardMaterial color="#713f12" roughness={0.9} />
      </mesh>
      
      {/* Bench legs */}
      <mesh position={[-0.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#422006" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#422006" roughness={0.9} />
      </mesh>
    </group>
  );
};

// GreenArea component - using noise texture for more natural look
const GreenArea = ({ position, width, height, rotation = 0 }) => {
  return (
    <mesh 
      position={[position[0], position[1] + 0.01, position[2]]} 
      rotation={[0, rotation, 0]} 
      receiveShadow
    >
      <planeGeometry args={[width, height, 5, 5]} />
      <meshStandardMaterial 
        color="#4ade80" 
        roughness={0.9}
        metalness={0.1}
        wireframe={false}
      />
    </mesh>
  );
};

// Enhanced ground component with textures
const Ground = ({ isNightMode }) => {
  // Create ground segments for different areas
  const groundSegments = [
    // Main campus areas - concrete
    { position: [0, -0.5, 0], size: [1000, 1000], type: 'concrete' },
    
    // Green areas - various sized grass patches
    { position: [-20, -0.45, -30], size: [40, 30], type: 'grass', rotation: 0.2 },
    { position: [40, -0.45, 20], size: [30, 35], type: 'grass', rotation: -0.3 },
    { position: [-50, -0.45, 40], size: [25, 45], type: 'grass', rotation: 0.1 },
    { position: [10, -0.45, 60], size: [55, 25], type: 'grass', rotation: -0.15 },
    { position: [70, -0.45, -40], size: [20, 30], type: 'grass', rotation: 0.4 },
    { position: [-70, -0.45, -70], size: [30, 30], type: 'grass', rotation: -0.25 },
    
    // Smaller green areas
    { position: [0, -0.45, -10], size: [15, 15], type: 'grass', rotation: 0 },
    { position: [25, -0.45, 0], size: [10, 12], type: 'grass', rotation: 0.5 },
    { position: [-30, -0.45, 20], size: [20, 18], type: 'grass', rotation: -0.3 },
  ];
  
  const ambientColor = isNightMode ? '#0f172a' : '#f1f5f9';
  
  return (
    <>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial 
          color="#94a3b8" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Add ground segments */}
      {groundSegments.map((segment, index) => {
        if (segment.type === 'grass') {
          return (
            <GreenArea
              key={`grass-${index}`}
              position={[segment.position[0], segment.position[1], segment.position[2]]}
              width={segment.size[0]}
              height={segment.size[1]}
              rotation={segment.rotation || 0}
            />
          );
        }
        return null;
      })}
    </>
  );
};

// Enhanced paths with texture and glow
const CampusPaths = ({ isNightMode }) => {
  // Define more detailed path network
  const mainPaths = [
    // Main paths connecting major buildings
    [-84.050, 9.937, -84.049, 9.936], // Library to Education Faculty
    [-84.049, 9.936, -84.051, 9.939], // Education Faculty to Cafeteria
    [-84.051, 9.939, -84.049, 9.938], // Cafeteria to General Studies
    [-84.049, 9.938, -84.049, 9.941], // General Studies to Social Sciences
    [-84.049, 9.941, -84.052, 9.937], // Social Sciences to Letters Faculty
    [-84.052, 9.937, -84.052, 9.940], // Letters Faculty to Engineering Faculty
    [-84.052, 9.940, -84.050, 9.937], // Engineering Faculty to Library

    // Secondary paths
    [-84.050, 9.937, -84.051, 9.939], // Direct Library to Cafeteria
    [-84.049, 9.936, -84.049, 9.938], // Direct Education to General Studies
    [-84.049, 9.938, -84.052, 9.937], // Direct General Studies to Letters
  ];
  
  // Convert path coordinates and create path meshes
  return (
    <group>
      {mainPaths.map((path, index) => {
        // Convert coordinates to 3D space
        const startX = (path[0] - -84.05) * 500;
        const startZ = (path[1] - 9.94) * 500;
        const endX = (path[2] - -84.05) * 500;
        const endZ = (path[3] - 9.94) * 500;
        
        // Calculate midpoint, length and angle
        const midX = (startX + endX) / 2;
        const midZ = (startZ + endZ) / 2;
        const dx = endX - startX;
        const dz = endZ - startZ;
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);
        
        // Path width varies slightly to add realism
        const pathWidth = 2 + Math.random() * 0.5;
        
        return (
          <group key={`path-${index}`}>
            {/* Main path */}
            <mesh 
              position={[midX, -0.4, midZ]} 
              rotation={[0, angle, 0]}
              receiveShadow
            >
              <boxGeometry args={[length, 0.2, pathWidth]} />
              <meshStandardMaterial 
                color="#cbd5e1" 
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            
            {/* Path edges */}
            <mesh 
              position={[midX, -0.39, midZ + (pathWidth/2) * Math.cos(angle + Math.PI/2)]} 
              rotation={[0, angle, 0]}
              receiveShadow
            >
              <boxGeometry args={[length, 0.22, 0.3]} />
              <meshStandardMaterial 
                color="#94a3b8" 
                roughness={0.9}
              />
            </mesh>
            <mesh 
              position={[midX, -0.39, midZ - (pathWidth/2) * Math.cos(angle + Math.PI/2)]} 
              rotation={[0, angle, 0]}
              receiveShadow
            >
              <boxGeometry args={[length, 0.22, 0.3]} />
              <meshStandardMaterial 
                color="#94a3b8" 
                roughness={0.9}
              />
            </mesh>
            
            {/* Night lighting for paths */}
            {isNightMode && (
              <mesh 
                position={[midX, -0.35, midZ]} 
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[length, 0.1, pathWidth - 0.5]} />
                <meshStandardMaterial 
                  color="#e2e8f0" 
                  emissive="#e2e8f0"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Sky component with clouds and day/night cycle
const EnhancedSky = ({ timeOfDay, isNightMode }) => {
  // Convert time of day (0-100) to sun position
  // 0 = 6am, 25 = 12pm, 50 = 6pm, 75 = 12am, 100 = 6am
  const sunPosition = () => {
    const normalizedTime = (timeOfDay % 100) / 100; // 0 to 1
    const angle = normalizedTime * Math.PI * 2; // 0 to 2π
    
    // Calculate sun position - highest at noon (25), lowest at midnight (75)
    const height = Math.sin(angle + Math.PI/2);
    const distance = Math.cos(angle + Math.PI/2);
    
    return [distance * 100, height * 100, 0];
  };
  
  const isDusk = timeOfDay > 40 && timeOfDay < 60;
  const isDawn = timeOfDay > 90 || timeOfDay < 10;
  
  // Sky parameters based on time of day
  const skyParams = {
    turbidity: isNightMode ? 0.5 : 10,
    rayleigh: isNightMode ? 0.5 : 0.5,
    mieCoefficient: isNightMode ? 0.005 : 0.005,
    mieDirectionalG: 0.8,
    inclination: 0.49, // Fixed, we use sunPosition for movement
    azimuth: 0.25,
  };
  
  return (
    <>
      <Sky 
        distance={450000} 
        {...skyParams}
        sunPosition={sunPosition()}
      />
      
      {/* Add clouds - more visible during day */}
      {!isNightMode && (
        <>
          <Cloud position={[-40, 30, -60]} speed={0.2} opacity={0.7} />
          <Cloud position={[40, 40, 40]} speed={0.1} opacity={0.6} />
          <Cloud position={[-60, 35, 30]} speed={0.3} opacity={0.5} />
          <Cloud position={[70, 45, -20]} speed={0.15} opacity={0.8} />
        </>
      )}
      
      {/* Night stars */}
      {isNightMode && (
        <Stars />
      )}
    </>
  );
};

// Simple Stars component
const Stars = () => {
  const starsRef = useRef();
  const starCount = 500;
  const starPositions = [];
  
  // Generate random star positions in a dome shape
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.5;
    const r = 150 + Math.random() * 100;
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    starPositions.push(x, y, z);
  }
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });
  
  return (
    <group ref={starsRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={new Float32Array(starPositions)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.5} 
          color="#ffffff" 
          sizeAttenuation={false}
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
};

// Enhanced CameraController
const CameraController = ({ onCameraChange }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    camera.position.set(30, 30, 30);
    camera.lookAt(0, 0, 0);
    
    if (onCameraChange) {
      onCameraChange(camera.position);
    }
  }, [camera, onCameraChange]);
  
  useFrame(() => {
    if (controlsRef.current && onCameraChange) {
      onCameraChange(camera.position);
    }
  });
  
  return (
    <OrbitControls 
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
      minDistance={10}
      maxDistance={150}
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below ground level
    />
  );
};

// Info panel displayed when a building is selected
const BuildingInfoPanel = ({ building, onClose }) => {
  if (!building) return null;
  
  const occupancyPercentage = Math.round((building.currentOccupancy / building.capacity) * 100);
  
  // Get occupancy status and color
  let statusColor, statusText;
  if (occupancyPercentage < 40) {
    statusColor = '#0f8';
    statusText = 'Baja';
  } else if (occupancyPercentage < 70) {
    statusColor = '#f80';
    statusText = 'Media';
  } else {
    statusColor = '#f08';
    statusText = 'Alta';
  }
  
  return (
    <div className="building-info-panel">
      <button className="close-button" onClick={onClose}>×</button>
      <h2>{building.name}</h2>
      <p>{building.info}</p>
      
      <div className="info-section">
        <h3>Ocupación Actual</h3>
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{
              width: `${occupancyPercentage}%`,
              backgroundColor: statusColor,
              boxShadow: `0 0 10px ${statusColor}`
            }}
          ></div>
        </div>
        <div className="occupancy-stats">
          <span style={{ color: statusColor }}>
            {building.currentOccupancy}/{building.capacity} ({occupancyPercentage}%)
          </span>
          <span style={{ color: statusColor }}>{statusText}</span>
        </div>
      </div>
      
      <div className="info-section">
        <h3>Horario</h3>
        <p>{building.openHours}</p>
      </div>
      
      <div className="info-section">
        <h3>Horas Pico</h3>
        <p>{building.peakHours}</p>
      </div>
      
      <div className="info-section">
        <h3>Reglas</h3>
        <p>{building.rules}</p>
      </div>
      
      <div className="info-section">
        <h3>Servicios</h3>
        <p>{Array.isArray(building.services) ? building.services.join(", ") : "No services available"}</p>
      </div>
    </div>
  );
};

// Custom scene lighting
const SceneLighting = ({ isNightMode, timeOfDay }) => {
  // Determine light intensities based on time of day/night mode
  const ambientIntensity = isNightMode ? 0.1 : 0.4;
  
  // Sunlight intensity based on time of day
  const sunIntensity = () => {
    if (isNightMode) return 0.1;
    
    const normalizedTime = (timeOfDay % 100) / 100; // 0 to 1
    // Highest at noon (25%), lowest at midnight (75%)
    return Math.max(0.2, Math.sin(normalizedTime * Math.PI * 2 + Math.PI/2) * 0.8 + 0.2);
  };
  
  // Sun position based on time of day
  const sunPosition = () => {
    const normalizedTime = (timeOfDay % 100) / 100; // 0 to 1
    const angle = normalizedTime * Math.PI * 2; // 0 to 2π
    
    const height = Math.sin(angle + Math.PI/2) * 100;
    const xz = Math.cos(angle + Math.PI/2) * 100;
    
    return [xz, Math.max(5, height), xz];
  };
  
  // Moonlight for night
  const moonlightColor = '#8fb3ff'; // Slight blue tint for moonlight
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={ambientIntensity} color={isNightMode ? moonlightColor : '#ffffff'} />
      
      {/* Directional light (sun/moon) */}
      <directionalLight 
        position={sunPosition()} 
        intensity={sunIntensity()} 
        color={isNightMode ? moonlightColor : '#ffffff'}
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Night lights around campus */}
      {isNightMode && (
        <>
          <pointLight position={[0, 10, 0]} intensity={0.3} color="#0ff" />
          <pointLight position={[20, 5, 20]} intensity={0.2} color="#f0f" />
          <pointLight position={[-20, 5, -20]} intensity={0.2} color="#0f8" />
          <pointLight position={[40, 5, -30]} intensity={0.2} color="#f80" />
          <pointLight position={[-40, 5, 30]} intensity={0.2} color="#0ff" />
        </>
      )}
    </>
  );
};

// Enhanced Campus3DMap
const Campus3DMap = ({ buildings, onBuildingSelect }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(25); // Default to noon (25)
  const [showLabels, setShowLabels] = useState(true);
  const [cameraPosition, setCameraPosition] = useState([30, 30, 30]);
  
  // Auto set night mode based on time of day
  useEffect(() => {
    // Night between 6PM and 6AM (timeOfDay between 50-100)
    setIsNightMode(timeOfDay >= 50 && timeOfDay < 100);
  }, [timeOfDay]);
  
  // Create random props positions based on building positions
  const createEnvironmentProps = () => {
    // Make sure buildings is an array before using it
    const buildingsArray = Array.isArray(buildings) ? buildings : [];
    
    // Generate trees positions
    const trees = [];
    const treeCount = 50;
    
    for (let i = 0; i < treeCount; i++) {
      // Random position within campus bounds
      let x = (Math.random() * 200) - 100;
      let z = (Math.random() * 200) - 100;
      
      // Don't place trees too close to buildings
      let tooClose = false;
      buildingsArray.forEach(building => {
        const buildingX = (building.position[1] - -84.05) * 500;
        const buildingZ = (building.position[0] - 9.94) * 500;
        const width = building.width || 5;
        const depth = building.depth || 5;
        
        // Check if tree is too close to the building
        const distX = Math.abs(x - buildingX);
        const distZ = Math.abs(z - buildingZ);
        
        if (distX < width * 1.2 && distZ < depth * 1.2) {
          tooClose = true;
        }
      });
      
      // Only add trees that aren't too close to buildings
      if (!tooClose) {
        const scale = 0.8 + Math.random() * 0.8; // Random scale for variety
        trees.push({ position: [x, 0, z], scale });
      }
    }
    
    // Generate benches near buildings
    const benches = [];
    const benchCount = 15;
    
    buildingsArray.forEach(building => {
      const buildingX = (building.position[1] - -84.05) * 500;
      const buildingZ = (building.position[0] - 9.94) * 500;
      const width = building.width || 5;
      const depth = building.depth || 5;
      
      // Add 1-2 benches near each building
      const benchesPerBuilding = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < benchesPerBuilding; i++) {
        // Position benches at a reasonable distance from buildings
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(width, depth) * 1.5;
        
        const x = buildingX + Math.cos(angle) * distance;
        const z = buildingZ + Math.sin(angle) * distance;
        
        benches.push({
          position: [x, 0, z],
          rotation: Math.random() * Math.PI * 2
        });
      }
    });
    
    // Generate fountains in open areas
    const fountains = [];
    const fountainPositions = [
      [-30, 0, 20],  // Central plaza
      [40, 0, -30],  // Near engineering
      [-20, 0, -50]  // Near library
    ];
    
    fountainPositions.forEach(position => {
      // Check if fountain is too close to buildings
      let tooClose = false;
      buildingsArray.forEach(building => {
        const buildingX = (building.position[1] - -84.05) * 500;
        const buildingZ = (building.position[0] - 9.94) * 500;
        
        const distX = Math.abs(position[0] - buildingX);
        const distZ = Math.abs(position[2] - buildingZ);
        
        if (distX < 15 && distZ < 15) {
          tooClose = true;
        }
      });
      
      if (!tooClose) {
        fountains.push({ position });
      }
    });
    
    return { trees, benches, fountains };
  };
  
  // Generate environment props
  const environmentProps = createEnvironmentProps();
  
  // Handle building click
  const handleBuildingClick = (id) => {
    const building = Array.isArray(buildings) ? buildings.find(b => b.id === id) : null;
    setSelectedBuilding(building);
    if (building && onBuildingSelect) {
      onBuildingSelect(building);
    }
  };
  
  // Toggle night mode
  const handleToggleNightMode = () => {
    setIsNightMode(prev => !prev);
    // Set appropriate time of day
    setTimeOfDay(prev => isNightMode ? 25 : 75);
  };
  
  // Handle time of day change
  const handleTimeChange = (value) => {
    setTimeOfDay(value);
    // Automatically set night mode
    setIsNightMode(value >= 50 && value < 100);
  };
  
  // Reset camera to default view
  const handleResetView = () => {
    // Implementation depends on how you handle the camera
    // This will be handled by the Camera component
  };
  
  // Start campus tour
  const handleStartTour = () => {
    // Implementation for campus tour animation
    // Could be implemented with camera animations
  };
  
  // Toggle building labels
  const handleToggleLabels = () => {
    setShowLabels(prev => !prev);
  };
  
  // Handle camera position change
  const handleCameraChange = (position) => {
    setCameraPosition(position);
  };
  
  // Make sure buildings is an array before using it
  const buildingsArray = Array.isArray(buildings) ? buildings : [];
  
  return (
    <div className="campus-3d-map-container">
      <Canvas shadows camera={{ position: [30, 30, 30], fov: 60 }}>
        <fog attach="fog" args={[isNightMode ? '#0f172a' : '#f8fafc', 30, 200]} />
        <CameraController onCameraChange={handleCameraChange} />
        <SceneLighting isNightMode={isNightMode} timeOfDay={timeOfDay} />
        
        {/* Sky and environment */}
        <EnhancedSky isNightMode={isNightMode} timeOfDay={timeOfDay} />
        
        {/* Ground and paths */}
        <Ground isNightMode={isNightMode} />
        <CampusPaths isNightMode={isNightMode} />
        
        {/* Campus buildings */}
        {buildingsArray.map(building => (
          <Building 
            key={building.id} 
            building={building} 
            onClick={handleBuildingClick} 
            isNightMode={isNightMode}
          />
        ))}
        
        {/* Environmental props - trees */}
        {environmentProps.trees.map((tree, index) => (
          <Tree 
            key={`tree-${index}`} 
            position={tree.position} 
            scale={tree.scale} 
          />
        ))}
        
        {/* Benches */}
        {environmentProps.benches.map((bench, index) => (
          <Bench 
            key={`bench-${index}`} 
            position={bench.position} 
            rotation={bench.rotation} 
          />
        ))}
        
        {/* Fountains */}
        {environmentProps.fountains.map((fountain, index) => (
          <Fountain 
            key={`fountain-${index}`} 
            position={fountain.position} 
          />
        ))}
      </Canvas>
      
      {/* Map controls UI */}
      <MapControls 
        onTourStart={handleStartTour}
        onReset={handleResetView}
        onToggleBuildingLabels={handleToggleLabels}
        showLabels={showLabels}
        onToggleNightMode={handleToggleNightMode}
        isNightMode={isNightMode}
        timeOfDay={timeOfDay}
        onTimeChange={handleTimeChange}
      />
      
      {/* Building info panel */}
      {selectedBuilding && (
        <BuildingInfoPanel 
          building={selectedBuilding} 
          onClose={() => setSelectedBuilding(null)} 
        />
      )}
    </div>
  );
};

export default Campus3DMap;