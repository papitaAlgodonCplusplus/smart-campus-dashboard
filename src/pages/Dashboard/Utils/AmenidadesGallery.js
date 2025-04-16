import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// Golden ratio for frame dimensions
const GOLDENRATIO = 1.61803398875;

// Main AmenidadesGallery component
const AmenidadesGallery = ({ spaces = [] }) => {
  const [rotation, setRotation] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Generate gallery items from spaces data
  const items = spaces.length > 0 ? spaces.map((space) => {
    const capacity = space.capacity || 1;
    const occupancy = space.currentOccupancy || 0;
    const percentage = Math.floor((occupancy / capacity) * 100);
    const color = percentage > 80 ? '#f08' : percentage > 50 ? '#f80' : '#0f8';
    return {
      id: space._id,
      name: space.name,
      building: space.building,
      capacity,
      occupancy,
      percentage,
      color,
      url: '/images/default.jpg', // Placeholder image
    };
  }) : Array(8).fill(0).map((_, i) => ({
    id: `demo-${i}`,
    name: `Amenidad ${i + 1}`,
    building: `Edificio ${i + 1}`,
    capacity: 100,
    occupancy: Math.floor(Math.random() * 100),
    percentage: Math.floor(Math.random() * 100),
    color: ['#f08', '#f80', '#0f8'][Math.floor(Math.random() * 3)],
    url: '/images/default.jpg', // Placeholder image
  }));

  // Rotate gallery left
  const rotateLeft = () => {
    setRotation((prev) => prev - Math.PI / 8);
  };

  // Rotate gallery right
  const rotateRight = () => {
    setRotation((prev) => prev + Math.PI / 8);
  };

  return (
    <div>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 35, position: [0, 0, 4] }} style={{ height: '32rem' }}>
        <color attach="background" args={['#08080f']} />
        <fog attach="fog" args={['#08080f', 5, 15]} />
        <CircularGallery 
          items={items} 
          rotation={rotation} 
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
        />
        <Environment preset="city" />
      </Canvas>
      
      {/* Navigation Controls - Positioned at bottom center */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 z-10">
        <button 
          onClick={rotateLeft}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-900 hover:bg-opacity-20 focus:outline-none transition-all duration-300"
          style={{ boxShadow: '0 0 10px #0ff, inset 0 0 5px #0ff' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        
        <button 
          onClick={rotateRight}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-900 hover:bg-opacity-20 focus:outline-none transition-all duration-300"
          style={{ boxShadow: '0 0 10px #0ff, inset 0 0 5px #0ff' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Circular gallery component
function CircularGallery({ items, rotation, selectedItemId, setSelectedItemId }) {
  const groupRef = useRef();
  const angle = (Math.PI * 2) / items.length; // Angle between items
  const radius = 6; // Radius of the circular arrangement

  // Smoothly rotate the entire gallery
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetRotation = rotation;
      const currentRotation = groupRef.current.rotation.y;
      const smoothFactor = 0.25;
      
      // Calculate the next rotation with simple lerp
      groupRef.current.rotation.y += (targetRotation - currentRotation) * smoothFactor * delta * 10;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
      
      {items.map((item, index) => (
        <GalleryItem
          key={item.id}
          item={item}
          position={[
            Math.sin(angle * index) * radius, // X position
            0, // Y position
            Math.cos(angle * index) * radius, // Z position
          ]}
          rotation={[0, Math.PI + angle * index, 0]} // Rotate to face the center
          isSelected={selectedItemId === item.id}
          onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
        />
      ))}
    </group>
  );
}

// Individual gallery item
function GalleryItem({ item, isSelected, onClick, ...props }) {
  const groupRef = useRef();
  const frameRef = useRef();
  const imageRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [rnd] = useState(() => Math.random());
  
  // Enhanced zoom and float effect when selected
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Zoom to camera when selected
      if (isSelected) {
        // Move toward camera and slightly up when selected
        const targetPos = new THREE.Vector3(0, 0, -1.5);

        // Faster interpolation for position and rotation
        groupRef.current.position.lerp(targetPos, delta * 5);
      } else {
        // Return to original position when not selected
        const originalPos = new THREE.Vector3(props.position[0], props.position[1], props.position[2]);
        const originalRot = new THREE.Euler(props.rotation[0], props.rotation[1], props.rotation[2]);

        // Faster interpolation back to original position and rotation
        groupRef.current.position.lerp(originalPos, delta * 5);
      }
    }
    
    // Frame color effect on hover or selection
    if (frameRef.current && frameRef.current.material) {
      const targetColor = hovered || isSelected ? new THREE.Color(item.color) : new THREE.Color('white');
      const currentColor = frameRef.current.material.color;
      
      // Smoothly interpolate color
      currentColor.r += (targetColor.r - currentColor.r) * 0.1 * delta * 10;
      currentColor.g += (targetColor.g - currentColor.g) * 0.1 * delta * 10;
      currentColor.b += (targetColor.b - currentColor.b) * 0.1 * delta * 10;
    }
    
    // Image scale effect on hover
    if (imageRef.current) {
      const targetScale = hovered && !isSelected ? 0.95 : 1;
      
      // Custom smooth scale interpolation
      imageRef.current.scale.x += (targetScale - imageRef.current.scale.x) * 0.1 * delta * 10;
      imageRef.current.scale.y += (targetScale - imageRef.current.scale.y) * 0.1 * delta * 10;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Frame */}
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        scale={[1, GOLDENRATIO, 0.05]}
      >
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        </mesh>
        
        {/* Frame border with glow effect */}
        <mesh ref={frameRef} scale={[1.05, 1.05, 1.1]} position={[0, 0, 0]}>
          <boxGeometry />
          <meshBasicMaterial color="white" toneMapped={false} />
        </mesh>
        
        {/* Image */}
        <group ref={imageRef} position={[0, 0, 0.7]}>
          <Image
            url={item.url}
            scale={[0.9, 0.9 / GOLDENRATIO, 1]}
            position={[0, 0, 0]}
            transparent
            opacity={0.9}
          />
        </group>
      </group>
      
      {/* Item name with glow effect */}
      <Text
        position={[0, GOLDENRATIO / 2 + 0.3, 0]}
        fontSize={0.15}
        color={isSelected || hovered ? item.color : "white"}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {item.name}
      </Text>
      
      {/* Display details when selected with enhanced visibility */}
      {isSelected && (
        <group position={[0, -GOLDENRATIO / 2 - 0.2, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {`Ocupación: ${item.occupancy}/${item.capacity}`}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.14}
            color={item.color}
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {`${item.percentage}%`}
          </Text>
          
          {/* Additional details for selected item */}
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.1}
            color="#8fb3ff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {item.building}
          </Text>
        </group>
      )}
    </group>
  );
}

export default AmenidadesGallery;