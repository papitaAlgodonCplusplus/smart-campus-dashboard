import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSpaces, fetchHourlyData, fetchReservations, createReservation, deleteReservation as apiDeleteReservation } from '../../services/api';
import { Reservation, ReservationFormData } from '../../types/ReservationTypes';
import LoadingMinigame from './LoadingMinigame';

// Define space data interface
export interface Space {
    _id: string;
    name: string;
    building: string;
    floor: number;
    capacity: number;
    currentOccupancy: number;
    lastUpdated: Date;
    position?: [number, number]; // Coordinates for map location

    // Additional fields for 3D map view
    info?: string;
    openHours?: string;
    peakHours?: string;
    rules?: string;
    services?: string[];
    height?: number;
    width?: number;
    depth?: number;
}

// Categories definition
export const categories = {
    facultades: ["Biblioteca", "Educación", "Estudios Generales", "Ciencias Sociales", "Letras", "Ingeniería",
        "Ciencias Económicas", "Derecho", "Biblioteca Tinoco", "Medicina", "Química", "Física y Matemática",
        "Bellas Artes", "Artes Musicales", "Farmacia", "Microbiología", "Biblioteca Salud", "Arquitectura",
        "ECCI", "Biología", "Agroalimentarias"],
    sodas: ["Comedor", "Soda", "Cafetería"],
    amenidades: ["Administrativo", "Informática", "Bienestar y Salud", "Federación de Estudiantes", "Auditorio",
        "Confucio", "Teatro", "Control", "Asesoría", "Red Sismológica", "Centro de Investigación",
        "Servicios", "Investigación", "Software Libre"],
    museos: ["Museo", "Jardín", "CIICLA"],
    monumentos: ["Espacio Común", "Monumento"]
};

// Define context interface with reservations
interface DashboardContextData {
    spaces: Space[];
    loading: boolean;
    error: string | null;
    hourlyData: any[];
    visibleLines: { [key: string]: boolean };
    loadingProgress: number;
    // Categorized spaces
    categorizedSpaces: {
        facultades: Space[];
        sodas: Space[];
        amenidades: Space[];
        museos: Space[];
        monumentos: Space[];
    };
    // Pie chart data
    pieData: { name: string; value: number }[];
    // Methods
    toggleLineVisibility: (spaceKey: string) => void;
    
    // Reservation methods
    reservations: Reservation[];
    addReservation: (formData: ReservationFormData) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;
    getUserReservations: (userName: string) => Reservation[];
    getSpaceReservations: (spaceId: string) => Reservation[];
    getAvailableTimeSlots: (spaceId: string, date: string) => { start: string; end: string }[];
    getReservedTimeSlots: (spaceId: string, date: string) => { start: string; end: string }[];
    isTimeSlotAvailable: (spaceId: string, date: string, startTime: string, endTime: string) => boolean;
    refreshReservations: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextData | undefined>(undefined);

// Time slots available for reservations (hourly increments)
const ALL_TIME_SLOTS = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

// Fallback hourly data generation in case API fails
const generateHourlyData = (spaces: Space[]) => {
    const hours = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'];

    return hours.map(hour => {
        // Create base object with hour
        const dataPoint: any = { hour };

        // Generate random but realistic occupancy data for each space
        spaces.forEach(space => {
            // Create a space key that's safe for object properties
            const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');

            // Generate percentage based on typical patterns
            let basePercentage = 0;
            const hourNum = parseInt(hour.replace('AM', '').replace('PM', ''));

            // Morning hours gradually increase
            if (hour.includes('AM')) {
                basePercentage = hourNum * 8;
            }
            // Peak at noon
            else if (hour === '12PM') {
                basePercentage = 80;
            }
            // Afternoon has higher occupancy with gradual decline
            else {
                basePercentage = 75 - ((hourNum) * 10);
            }

            // Add some randomness for realism
            const percentage = Math.min(100, Math.max(5,
                basePercentage + (Math.random() * 20 - 10)
            ));

            dataPoint[spaceKey] = Math.round(percentage);
        });

        return dataPoint;
    });
};

// Provider component
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hourlyData, setHourlyData] = useState<any[]>([]);
    const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>({});
    const [loadingProgress, setLoadingProgress] = useState<number>(0); // Loading progress for game/progress bar
    const [loadingComplete, setLoadingComplete] = useState<boolean>(false);

    // Add reservations state
    const [reservations, setReservations] = useState<Reservation[]>([]);

    // Function to categorize spaces
    const categorizeSpaces = () => {
        return {
            facultades: spaces.filter(space =>
                space.building && categories.facultades.some(cat => space.building.includes(cat))),
            sodas: spaces.filter(space =>
                space.building && categories.sodas.some(cat => space.building.includes(cat))),
            amenidades: spaces.filter(space =>
                space.building && categories.amenidades.some(cat => space.building.includes(cat))),
            museos: spaces.filter(space =>
                space.building && categories.museos.some(cat => space.building.includes(cat))),
            monumentos: spaces.filter(space =>
                space.building && categories.monumentos.some(cat => space.building.includes(cat)))
        };
    };

    // Calculate categorized spaces
    const categorizedSpaces = categorizeSpaces();

    // Data for pie chart
    const pieData = [
        { name: 'Disponible', value: spaces.reduce((acc, space) => acc + (space.capacity - space.currentOccupancy), 0) },
        { name: 'Ocupado', value: spaces.reduce((acc, space) => acc + space.currentOccupancy, 0) }
    ];

    // Initialize visible lines
    useEffect(() => {
        if (spaces.length > 0 && hourlyData.length > 0) {
            // Initialize all lines as visible
            const initialVisibleLines: { [key: string]: boolean } = {};
            spaces.forEach(space => {
                const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');
                initialVisibleLines[spaceKey] = true;
            });
            setVisibleLines(initialVisibleLines);
        }
    }, [spaces, hourlyData]);

    // Simulate loading progress
    useEffect(() => {
        if (loading && loadingProgress < 100) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    // Calculate new progress based on data loading state
                    // When actual data loads, we'll jump to 100%
                    const increment = (spaces.length > 0 ? 3 : 1) + (hourlyData.length > 0 ? 3 : 1);
                    return Math.min(95, prev + increment); // Cap at 95% until data fully loads
                });
            }, 300);
            
            return () => clearInterval(interval);
        }
    }, [loading, loadingProgress, spaces.length, hourlyData.length]);

    // Fetch reservations from API
    const loadReservations = async () => {
        try {
            const data = await fetchReservations();
            if (data && Array.isArray(data)) {
                setReservations(data);
            }
        } catch (err) {
            console.error('Failed to fetch reservations', err);
            setError('Failed to fetch reservations: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    // Refresh reservations
    const refreshReservations = async () => {
        await loadReservations();
    };

    // Toggle visibility of specific lines
    const toggleLineVisibility = (spaceKey: string) => {
        setVisibleLines(prev => ({
            ...prev,
            [spaceKey]: !prev[spaceKey]
        }));
    };

    // Fetch spaces data
    useEffect(() => {
        const getSpaces = async () => {
            try {
                setLoading(true);
                const data = await fetchSpaces();
                if (data && data.length > 0) {
                    setSpaces(data);
                    // Progress boost when spaces load
                    setLoadingProgress(prev => Math.min(75, prev + 25));
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch spaces', err);
                setError('Failed to fetch spaces data: ' + (err instanceof Error ? err.message : 'Unknown error'));
                // Ensure some progress even on error
                setLoadingProgress(prev => Math.min(80, prev + 20));
            }
        };

        getSpaces();
    }, []);

    // Fetch hourly data from API
    useEffect(() => {
        const getHourlyData = async () => {
            try {
                if (spaces.length > 0) {
                    const data = await fetchHourlyData();

                    if (data && data.length > 0) {
                        setHourlyData(data);
                    } else {
                        // Fall back to generated data if API returns empty result
                        console.warn('No hourly data available from API, generating fallback data');
                        setHourlyData(generateHourlyData(spaces));
                    }
                    
                    // Progress boost when hourly data loads
                    setLoadingProgress(prev => Math.min(90, prev + 20));
                }
            } catch (err) {
                console.error('Failed to fetch hourly data', err);
                // Fall back to generated data on error
                console.warn('Using generated hourly data as fallback');
                setHourlyData(generateHourlyData(spaces));
                // Ensure some progress even on error
                setLoadingProgress(prev => Math.min(90, prev + 15));
            }
        };

        if (spaces.length > 0) {
            getHourlyData();
        }
    }, [spaces]);

    // Fetch reservations when component mounts
    useEffect(() => {
        const fetchAllData = async () => {
            await loadReservations();
            // Complete loading when all data is fetched
            setLoadingProgress(100);
            // Add small delay before completing loading
            setTimeout(() => {
                setLoading(false);
                setLoadingComplete(true);
            }, 500);
        };
        
        fetchAllData();
    }, [hourlyData.length]);

    // Create CSS styling for charts
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      @keyframes neon-pulse {
        0% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.8); }
        50% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4); }
        100% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.8); }
      }
      
      .with-glow {
        animation: neon-pulse 2s infinite;
      }
      
      .recharts-text {
        fill: white !important;
        font-family: 'Rajdhani', sans-serif !important;
      }
      
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke: rgba(0, 255, 255, 0.2) !important;
      }
      
      .recharts-line-curve {
        filter: drop-shadow(0 0 3px currentColor);
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Reservation methods
    const addReservation = async (formData: ReservationFormData) => {
        try {
            // Create reservation via API for each selected space
            for (const spaceId of formData.spaces) {
                
                await createReservation({
                    ...formData,
                    spaces: [spaceId] // API expects a single space ID
                });
            }
            
            // Refresh reservations after adding
            await loadReservations();
        } catch (err) {
            console.error('Failed to create reservation', err);
            throw err; // Propagate error to form for handling
        }
    };

    const deleteReservation = async (id: string) => {
        try {
            await apiDeleteReservation(id);
            
            // Refresh reservations after deletion
            await loadReservations();
        } catch (err) {
            console.error('Failed to delete reservation', err);
            throw err; // Propagate error for handling
        }
    };

    const getUserReservations = (userName: string) => {
        return reservations.filter(reservation => reservation.userName === userName);
    };

    const getSpaceReservations = (spaceId: string) => {
        return reservations.filter(reservation => reservation.spaceId === spaceId);
    };

    const getReservedTimeSlots = (spaceId: string, date: string) => {
        return reservations
            .filter(reservation => 
                reservation.spaceId === spaceId && 
                reservation.date === date
            )
            .map(reservation => ({
                start: reservation.startTime,
                end: reservation.endTime
            }));
    };

    // Check if a time slot conflicts with existing reservations
    const isTimeSlotAvailable = (spaceId: string, date: string, startTime: string, endTime: string) => {
        const conflictingReservations = reservations.filter(reservation => {
            if (reservation.spaceId !== spaceId || reservation.date !== date) {
                return false;
            }

            // Convert times to minutes for easier comparison
            const convertToMinutes = (time: string) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const newStart = convertToMinutes(startTime);
            const newEnd = convertToMinutes(endTime);
            const existingStart = convertToMinutes(reservation.startTime);
            const existingEnd = convertToMinutes(reservation.endTime);

            // Check for any overlap
            return (
                (newStart < existingEnd && newStart >= existingStart) || // New start is within existing
                (newEnd > existingStart && newEnd <= existingEnd) || // New end is within existing
                (newStart <= existingStart && newEnd >= existingEnd) // New completely encloses existing
            );
        });

        return conflictingReservations.length === 0;
    };

    // Get available time slots for a space on a specific date
    const getAvailableTimeSlots = (spaceId: string, date: string) => {
        const reservedSlots = getReservedTimeSlots(spaceId, date);
        const availableSlots: { start: string; end: string }[] = [];

        // Iterate through all time slots and check if they're available
        for (let i = 0; i < ALL_TIME_SLOTS.length - 1; i++) {
            const start = ALL_TIME_SLOTS[i];
            const end = ALL_TIME_SLOTS[i + 1];

            if (isTimeSlotAvailable(spaceId, date, start, end)) {
                availableSlots.push({ start, end });
            }
        }

        return availableSlots;
    };

    // Render loading game if still loading
    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'var(--dark-bg)',
                zIndex: 9999
            }}>
                <LoadingMinigame 
                    loadingProgress={loadingProgress} 
                    onComplete={() => setLoading(false)}
                />
            </div>
        );
    }
    
    return (
        <DashboardContext.Provider
            value={{
                spaces,
                loading,
                error,
                hourlyData,
                visibleLines,
                loadingProgress,
                categorizedSpaces,
                pieData,
                toggleLineVisibility,
                
                // Reservation methods and state
                reservations,
                addReservation,
                deleteReservation,
                getUserReservations,
                getSpaceReservations,
                getAvailableTimeSlots,
                getReservedTimeSlots,
                isTimeSlotAvailable,
                refreshReservations
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

// Custom hook to use the dashboard context
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};