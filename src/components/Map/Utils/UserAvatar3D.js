import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CAMPUS_CONSTANTS } from '../../../data/campusConstants';
import './UserAvatar3D.css';

const UserAvatar3D = ({ position, followUser, onFollowUser }) => {
  const avatarRef = useRef();
  const pulseRef = useRef();
  const arrowRef = useRef();
  const followButtonRef = useRef();
  
  // User avatar customization
  const [avatarColor, setAvatarColor] = useState('#00ffff'); // Default cyan color
  const [pulseAnimation, setPulseAnimation] = useState('pulse'); // Default animation
  
  // Convert GPS coordinates to 3D space coordinates
  const convertCoordinates = (lat, lng) => {
    return CAMPUS_CONSTANTS.transformCoordinates(lat, lng);
  };
  
  // Position in 3D space
  const pos3D = position ? convertCoordinates(position[0], position[1]) : [0, 0, 0];
  
  // Previous position for movement tracking
  const prevPosRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const [movementSpeed, setMovementSpeed] = useState(0);
  
  // Update previous position and check if moving
  useEffect(() => {
    if (prevPosRef.current && position) {
      // Calculate distance between points
      const dx = position[0] - prevPosRef.current[0];
      const dy = position[1] - prevPosRef.current[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Convert to speed (distance per second)
      const speed = distance * 111000; // Rough conversion to meters (1 degree ≈ 111km)
      setMovementSpeed(speed);
      setIsMoving(speed > 0.5); // Moving if > 0.5 m/s
    }
    
    prevPosRef.current = position;
  }, [position]);
  
  // Animate the avatar
  useFrame((state, delta) => {
    if (avatarRef.current) {
      // Hover animation
      if (pulseAnimation === 'pulse') {
        avatarRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      } else if (pulseAnimation === 'bounce') {
        avatarRef.current.position.y = 2 + Math.abs(Math.sin(state.clock.elapsedTime * 3)) * 0.5;
      } else if (pulseAnimation === 'rotate') {
        avatarRef.current.rotation.y += delta * 2;
      }
      
      // If following user, move camera
      if (followUser && position && position[0] !== 0 && state.camera) {
        // Calculate camera offset based on movement
        const cameraOffsetDistance = isMoving ? 30 : 20;
        const cameraHeight = isMoving ? 25 : 20;
        
        // Calculate direction vector (where user is heading)
        let directionVector = new THREE.Vector3(0, 0, -1); // Default looking direction
        
        if (prevPosRef.current && position && isMoving) {
          // Get normalized direction vector from previous position
          const from3D = convertCoordinates(prevPosRef.current[0], prevPosRef.current[1]);
          const to3D = pos3D;
          
          // Create direction vector
          directionVector = new THREE.Vector3(
            to3D[0] - from3D[0],
            0, // Keep y at 0 to stay horizontal
            to3D[2] - from3D[2]
          ).normalize();
        }
        
        // Calculate camera position - put camera behind movement direction
        const cameraOffset = directionVector.clone().multiplyScalar(-cameraOffsetDistance);
        cameraOffset.y = cameraHeight; // Set height
        
        const targetPosition = new THREE.Vector3(pos3D[0], pos3D[1], pos3D[2]);
        const cameraTarget = targetPosition.clone().add(cameraOffset);
        
        // Smoothly move camera
        state.camera.position.lerp(cameraTarget, isMoving ? 0.05 : 0.02);
        
        // Make camera look at avatar
        state.camera.lookAt(pos3D[0], pos3D[1] + 2, pos3D[2]);
      }
    }
    
    // Pulse animation
    if (pulseRef.current) {
      pulseRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      pulseRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      pulseRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      pulseRef.current.material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    
    // Arrow animation
    if (arrowRef.current) {
      if (isMoving) {
        // Show arrow when moving and animate based on speed
        arrowRef.current.visible = true;
        arrowRef.current.position.y = 5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
        
        // Pulse the arrow faster when moving faster
        const pulseSpeed = Math.min(3 + (movementSpeed / 2), 8);
        const pulseScale = 0.7 + 0.3 * Math.sin(state.clock.elapsedTime * pulseSpeed);
        arrowRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      } else {
        // Hide arrow when stationary
        arrowRef.current.visible = false;
      }
    }
    
    // Follow button animation
    if (followButtonRef.current) {
      followButtonRef.current.rotation.y += delta;
      
      // Pulse effect when follow is active
      if (followUser) {
        followButtonRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        followButtonRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        followButtonRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });
  
  // Don't render if no position yet
  if (!position || position[0] === 0) return null;
  
  return (
    <group position={[pos3D[0], pos3D[1], pos3D[2]]}>
      {/* Main avatar dot */}
      <mesh ref={avatarRef} position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={avatarColor} 
          emissive={avatarColor}
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Pulse effect */}
      <mesh ref={pulseRef} position={[0, 2, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color={avatarColor} 
          emissive={avatarColor}
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.5}
        />
      </mesh>
      
      {/* Direction arrow (pointing down) - visible when moving */}
      <mesh ref={arrowRef} position={[0, 5, 0]}>
        <coneGeometry args={[0.7, 2, 16]} rotation={[Math.PI, 0, 0]} />
        <meshStandardMaterial 
          color={avatarColor} 
          emissive={avatarColor}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Text label */}
      <Billboard position={[0, 7, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          color="#ffffff"
          fontSize={1.2}
          maxWidth={10}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          outlineWidth={0.2}
          outlineColor="#000000"
        >
          {isMoving ? `Mi ubicación (${Math.round(movementSpeed * 3.6)} km/h)` : 'Mi ubicación'}
        </Text>
      </Billboard>
      
      {/* Follow me button */}
      <Billboard 
        position={[0, 9, 0]} 
        follow={true} 
        lockX={false} 
        lockY={false} 
        lockZ={false}
        ref={followButtonRef}
      >
        <mesh 
          onClick={() => onFollowUser(!followUser)}
          onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
          onPointerOut={(e) => (document.body.style.cursor = 'default')}
          className="follow-avatar-button-3d"
        >
          <boxGeometry args={[4, 1.5, 0.1]} />
          <meshStandardMaterial 
            color={followUser ? "#f08" : "#0f8"} 
            emissive={followUser ? "#f08" : "#0f8"}
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          color="#ffffff"
          fontSize={0.6}
          maxWidth={10}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
        >
          {followUser ? "Dejar de seguir" : "Seguir ubicación"}
        </Text>
      </Billboard>
      
      {/* Speed indicator - only visible when moving */}
      {isMoving && (
        <Billboard position={[0, 5, 0]} follow={true}>
          <Text
            color="#ffffff"
            fontSize={0.8}
            maxWidth={10}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            outlineWidth={0.2}
            outlineColor="#000000"
          >
            {Math.round(movementSpeed * 3.6)} km/h
          </Text>
        </Billboard>
      )}
    </group>
  );
};

export default UserAvatar3D;