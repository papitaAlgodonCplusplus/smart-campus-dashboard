import React, { useRef, useState, useMemo, useEffect } from 'react';
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



function CrystalBackground() {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color("#00ffff") },
    uColorB: { value: new THREE.Color("#ff00ff") },
    uColorC: { value: new THREE.Color("#0088ff") }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Custom shader for crystalline effect
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    
    varying vec2 vUv;
    
    // Noise functions from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
    
    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);
        
        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);
        
        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);
        
        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));
        
        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
        
        return o4.y * d.y + o4.x * (1.0 - d.y);
    }
    
    void main() {
      // Create a layered noise effect
      float n1 = noise(vec3(vUv * 3.0, uTime * 0.1));
      float n2 = noise(vec3(vUv * 6.0, uTime * 0.2 + 10.0));
      float n3 = noise(vec3(vUv * 12.0, uTime * 0.3 + 20.0));
      
      // Combine noises for a crystalline effect
      float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      // Create a rainbow gradient based on position and time
      vec3 color1 = mix(uColorA, uColorB, sin(uTime * 0.2 + vUv.x * 3.0) * 0.5 + 0.5);
      vec3 color2 = mix(uColorB, uColorC, cos(uTime * 0.3 + vUv.y * 3.0) * 0.5 + 0.5);
      vec3 finalColor = mix(color1, color2, finalNoise);
      
      // Add sparkles
      float sparkle = pow(n3, 8.0) * 2.0;
      finalColor += vec3(sparkle);
      
      // Add a subtle vignette
      float vignette = 1.0 - smoothstep(0.5, 1.0, length(vUv - 0.5) * 1.5);
      finalColor *= vignette * 0.5 + 0.5;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[40, 40]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
      <CrystalBubbles count={100} />
    </mesh>
  );
}

// Crystal Bubble effect
function CrystalBubbles({ count }) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    let bubbleCount = 0;

    const addBubble = () => {
      if (bubbleCount >= count) return;

      const newBubble = {
        position: [
          (Math.random() - 0.2) * 20,
          -3, // Start below the visible area
          (Math.random() - 0.2) * 10 - 5
        ],
        scale: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.2 + 0.05,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        color: [
          '#0ff',
          '#f0f',
          '#08f',
          '#0f8',
          '#f80',
          '#f08'
        ][Math.floor(Math.random() * 6)]
      };

      setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
      bubbleCount++;
    };

    const interval = setInterval(addBubble, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <group>
      {bubbles.map((bubble, i) => (
        <Bubble
          key={i}
          position={bubble.position}
          scale={bubble.scale}
          speed={bubble.speed}
          rotationSpeed={bubble.rotationSpeed}
          color={bubble.color}
        />
      ))}
    </group>
  );
}

// Individual bubble
function Bubble({ position, scale, speed, rotationSpeed, color }) {
  const meshRef = useRef();
  const initialPosition = useRef(position);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Float upward with slight wobble
      meshRef.current.position.y += speed * delta * 2;
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime * rotationSpeed) * 0.01;

      // Rotate
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.8;
      meshRef.current.rotation.z += delta * rotationSpeed * 0.6;

      // Reset position when it goes too high
      if (meshRef.current.position.y > initialPosition.current[1] + 15) {
        meshRef.current.position.y = initialPosition.current[1] - 5;
        meshRef.current.position.x = initialPosition.current[0] + (Math.random() - 0.5) * 2;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.6}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.2}
        envMapIntensity={2}
      />
    </mesh>
  );
}

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
        <CrystalBackground />
        <fog attach="fog" args={['#08080f', 5, 15]} />
        <ambientLight intensity={0.5} color="#ffffff" />
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
      <ambientLight intensity={10} color="#ffffff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          map={textures.map}
          normalMap={textures.normalMap}
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
        const currentRotation = groupRef.current.rotation.y;
        
        const z_index = Math.cos(currentRotation) * -2; // Adjusted Z position based on rotation
        const x_index = Math.sin(currentRotation) * -2; // Adjusted Y position based on rotation

        // Move toward camera and slightly up when selected
        const targetPos = new THREE.Vector3(x_index, 0, z_index);

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


  const textures = useTexture({
    map: bitumenTexture,
    normalMap: bitumenDisp,
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
        castShadow
        receiveShadow
      >
        <mesh castShadow receiveShadow>
          <boxGeometry />
          <meshStandardMaterial map={textures.map} normalMap={textures.normalMap} />
        </mesh>

        {/* Frame border with glow effect */}
        <mesh ref={frameRef} scale={[1.05, 1.05, 1.1]} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry />
          <meshStandardMaterial map={textures.map} normalMap={textures.normalMap} emissive={item.color} emissiveIntensity={0.1} roughness={0.9} metalness={0.1} />
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