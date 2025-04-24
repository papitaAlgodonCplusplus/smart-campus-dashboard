// src/types/EventTypes.ts

/**
 * Represents an event in the campus dashboard system
 */
export interface EventData {
    /**
     * Unique identifier for the event
     */
    id: string;
    
    /**
     * Title of the event
     */
    title: string;
    
    /**
     * Detailed description of the event
     */
    description: string;
    
    /**
     * Coordinates [latitude, longitude] for the event location
     */
    location: [number, number];
    
    /**
     * Human-readable name for the event location
     */
    locationName: string;
    
    /**
     * Start date and time of the event
     */
    startDate: Date;
    
    /**
     * End date and time of the event
     */
    endDate: Date;
    
    /**
     * Cost to attend the event in colones (0 for free events)
     */
    cost: number;
    
    /**
     * Event category
     */
    category: EventCategory;
    
    /**
     * Whether the event creator wishes to remain anonymous
     */
    isAnonymous: boolean;
    
    /**
     * Name of the event creator (or "Anónimo" if anonymous)
     */
    createdBy: string;
    
    /**
     * Timestamp when the event was created
     */
    createdAt: Date;
  }
  
  /**
   * Available event categories
   */
  export type EventCategory = 
    | 'academic'  // Academic events
    | 'cultural'  // Cultural activities
    | 'sports'    // Sports events
    | 'social'    // Social gatherings
    | 'career'    // Career fairs, interviews
    | 'celebration' // Celebrations and parties
    | 'other';    // Other events