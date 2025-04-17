import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshReflectorMaterial,
  Image,
  Text,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import bitumenTexture from '../../../textures/bitumen_diff_4k.jpg';
import bitumenDisp from '../../../textures/bitumen_disp_4k.png';

// Golden ratio for frame dimensions
const GOLDENRATIO = 1.61803398875;

// Default image path to use as fallback
const DEFAULT_IMAGE_PATH = '/images/default.jpg';

const Gallery = ({ spaces = [] }) => {
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
      color
    };
  }) : Array(8).fill(0).map((_, i) => ({
    id: `demo-${i}`,
    name: `Item ${i + 1}`,
    building: `Edificio ${i + 1}`,
    capacity: 100,
    occupancy: Math.floor(Math.random() * 100),
    percentage: Math.floor(Math.random() * 100),
    color: ['#f08', '#f80', '#0f8'][Math.floor(Math.random() * 3)]
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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 35, position: [0, 0, 4] }} style={{ height: '42rem' }}>
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
      <div style={{
        position: 'relative',
        bottom: '5rem',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10%',
        zIndex: 10
      }}>
        <button
          onClick={rotateLeft}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: '#0ff',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={rotateRight}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: '#0ff',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const radius = 8; // Radius of the circular arrangement

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

  const textures = useTexture({
    map: bitumenTexture,
    normalMap: bitumenDisp,
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
          envMapIntensity={0.5}
          toneMapped={false}
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

  // Enhanced zoom and float effect when selected
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Zoom to camera when selected
      if (isSelected) {
        // Move toward camera and slightly up when selected
        const targetPos = new THREE.Vector3(0, 0, -3);

        // Faster interpolation for position and rotation
        groupRef.current.position.lerp(targetPos, delta * 5);
      } else {
        // Return to original position when not selected
        const originalPos = new THREE.Vector3(props.position[0], props.position[1], props.position[2]);

        // Faster interpolation back to original position
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

        {/* Image with error handling - Using simple approach */}
        <group ref={imageRef} position={[0, 0, 0.7]}>
          <SimpleImage name={item.name} />
        </group>
      </group>

      {/* Item name with glow effect */}
      <Text
        position={[0, GOLDENRATIO / 2 + 0.3, 0]}
        fontSize={0.15}
        color={isSelected || hovered ? item.color : "white"}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
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
        </group>
      )}
    </group>
  );
}

// Simplified Image component that uses a standard texture
function SimpleImage({ name }) {
  // Always use the default image for simplicity and reliability
  return (
    <Image
      url={DEFAULT_IMAGE_PATH}
      scale={[0.9, 0.9 / GOLDENRATIO, 1]}
      transparent
      opacity={0.9}
    />
  );
}

export default Gallery;