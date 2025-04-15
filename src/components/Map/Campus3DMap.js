import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Custom Building component
const Building = ({ building, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Calculate building dimensions
  const height = building.height || 2 + (building.capacity / 200); // Height based on capacity
  const width = building.width || 3 + Math.random() * 2;
  const depth = building.depth || 3 + Math.random() * 2;

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

  // Animate on hover
  useFrame(() => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.1, 0.1);
      } else {
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      }
      
      // Add a subtle floating animation
      meshRef.current.position.y = height / 2 + Math.sin(Date.now() * 0.001 + building.id) * 0.05;
    }
  });

  // Scale position from Leaflet coordinates to 3D space
  const scaledPosition = [
    (building.position[1] - -84.05) * 10000, // X (longitude)
    height / 2, // Y (height)
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
          color={hovered ? '#0ff' : color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

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

// Ground plane component
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial 
        color="#041020" 
        emissive="#041020" 
        metalness={0.3}
        roughness={0.9}
      />
    </mesh>
  );
};

// Main path/road component
const CampusPaths = () => {
  // Simplified path coordinates for UCR campus (example)
  const pathPoints = [
    [-84.050, 9.937], // Library
    [-84.049, 9.936], // Education Faculty
    [-84.051, 9.939], // Cafeteria
    [-84.049, 9.938], // General Studies
    [-84.049, 9.941], // Social Sciences
    [-84.052, 9.937], // Letters Faculty
    [-84.052, 9.940], // Engineering Faculty
  ];

  // Convert path points to 3D space
  const scaledPoints = pathPoints.map(([lng, lat]) => {
    return [
      (lng - -84.05) * 10000, // X (longitude)
      0.05, // Y (slightly above ground)
      (lat - 9.94) * 10000 // Z (latitude)
    ];
  });
  
  return (
    <group>
      {scaledPoints.map((point, index) => {
        if (index < scaledPoints.length - 1) {
          const nextPoint = scaledPoints[index + 1];
          const midX = (point[0] + nextPoint[0]) / 2;
          const midZ = (point[2] + nextPoint[2]) / 2;
          
          // Calculate path length and rotation
          const dx = nextPoint[0] - point[0];
          const dz = nextPoint[2] - point[2];
          const length = Math.sqrt(dx * dx + dz * dz);
          const angle = Math.atan2(dz, dx);
          
          return (
            <mesh 
              key={`path-${index}`} 
              position={[midX, 0.05, midZ]} 
              rotation={[0, angle, 0]}
              receiveShadow
            >
              <boxGeometry args={[length, 0.1, 1]} />
              <meshStandardMaterial 
                color="#0ff" 
                emissive="#0ff"
                emissiveIntensity={0.3}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        }
        return null;
      })}
    </group>
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
const SceneLighting = () => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Directional light (sun) */}
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Point lights for ambient glow */}
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#0ff" />
      <pointLight position={[20, 10, 20]} intensity={0.3} color="#f0f" />
      <pointLight position={[-20, 10, -20]} intensity={0.3} color="#0f8" />
    </>
  );
};

// Camera controller
const CameraController = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    camera.position.set(30, 30, 30);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return <OrbitControls 
    ref={controlsRef}
    args={[camera, gl.domElement]}
    enableDamping
    dampingFactor={0.1}
    rotateSpeed={0.5}
    minDistance={10}
    maxDistance={100}
    maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below ground level
  />;
};

const Campus3DMap = ({ buildings, onBuildingSelect }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Make sure buildings is an array before using it
  const buildingsArray = Array.isArray(buildings) ? buildings : [];

  const handleBuildingClick = (id) => {
    const building = buildingsArray.find(b => b.id === id) || null;
    setSelectedBuilding(building);
    if (building && onBuildingSelect) {
      onBuildingSelect(building);
    }
  };

  return (
    <div className="campus-3d-map-container">
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 60 }} style={{ height: '70vh' }}>
        <fog attach="fog" args={['#020617', 30, 100]} />
        <CameraController />
        <SceneLighting />
        
        <Ground />
        <CampusPaths />
        
        {buildingsArray.map(building => (
          <Building 
            key={building.id} 
            building={building} 
            onClick={handleBuildingClick} 
          />
        ))}
      </Canvas>
      
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