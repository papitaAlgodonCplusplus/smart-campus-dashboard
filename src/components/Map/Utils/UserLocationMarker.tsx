import React, { useEffect, useRef } from 'react';
import { Marker, Tooltip, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface UserLocationMarkerProps {
  position: [number, number];
  accuracy: number;
  followUser: boolean;
}

// Create a custom icon for the user's location
const createUserIcon = () => {
  return new L.DivIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-avatar-container">
        <div class="user-avatar-dot"></div>
        <div class="user-avatar-pulse"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ 
  position, 
  accuracy,
  followUser
}) => {
  const map = useMap();
  const firstRenderRef = useRef(true);
  const previousPositionRef = useRef<[number, number] | null>(null);
  const userIcon = createUserIcon();

  // Move map to user's location if followUser is true
  useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      // Check if this is first render or we need to follow
      if (followUser || firstRenderRef.current) {
        map.flyTo(position, map.getZoom(), {
          animate: true,
          duration: firstRenderRef.current ? 1.5 : 0.5
        });
        
        firstRenderRef.current = false;
      }
      
      // Store current position for future comparison
      previousPositionRef.current = position;
    }
  }, [position, map, followUser]);

  // Calculate if the user has moved significantly
  const hasMovedSignificantly = () => {
    if (!previousPositionRef.current) return false;
    
    // Calculate distance between current and previous position
    const latDiff = Math.abs(position[0] - previousPositionRef.current[0]);
    const lngDiff = Math.abs(position[1] - previousPositionRef.current[1]);
    
    // Return true if moved more than a small threshold
    return (latDiff > 0.0001 || lngDiff > 0.0001);
  };

  return (
    <>
      {/* Accuracy circle */}
      <Circle 
        center={position} 
        radius={accuracy}
        pathOptions={{ 
          color: 'var(--neon-primary)',
          fillColor: 'var(--neon-primary)',
          fillOpacity: 0.1,
          weight: 1
        }}
      />
      
      {/* User marker */}
      <Marker 
        position={position} 
        icon={userIcon}
        zIndexOffset={1000} // Make sure it's above other markers
      >
        <Tooltip 
          direction="top" 
          offset={[0, -10]} 
          opacity={0.9} 
          permanent
          className="user-location-tooltip"
        >
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Mi ubicación
          </div>
        </Tooltip>
      </Marker>
      
      {/* Direction indicator */}
      {hasMovedSignificantly() && previousPositionRef.current && (
        <DirectionIndicator 
          previousPosition={previousPositionRef.current} 
          currentPosition={position} 
        />
      )}
    </>
  );
};

// Optional component to show movement direction
const DirectionIndicator = ({ 
  previousPosition, 
  currentPosition 
}: { 
  previousPosition: [number, number], 
  currentPosition: [number, number] 
}) => {
  // Calculate angle between previous and current position
  const angle = Math.atan2(
    currentPosition[0] - previousPosition[0],
    currentPosition[1] - previousPosition[1]
  ) * 180 / Math.PI;
  
  // Create a custom arrow icon
  const arrowIcon = new L.DivIcon({
    className: 'direction-indicator',
    html: `
      <div class="direction-arrow" style="transform: rotate(${angle}deg)">
        ➡️
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  return (
    <Marker
      position={currentPosition}
      icon={arrowIcon}
      zIndexOffset={999} // Just below the user marker
    />
  );
};

export default UserLocationMarker;