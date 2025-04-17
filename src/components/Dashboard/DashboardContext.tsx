import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSpaces } from '../../services/api';

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

// Define context interface
interface DashboardContextData {
    spaces: Space[];
    loading: boolean;
    error: string | null;
    hourlyData: any[];
    visibleLines: { [key: string]: boolean };
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
}

const DashboardContext = createContext<DashboardContextData | undefined>(undefined);

// Generate hourly data for charts
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

    // Function to categorize spaces
    const categorizeSpaces = () => {
        return {
            facultades: spaces.filter(space => categories.facultades.some(cat => space.building.includes(cat))),
            sodas: spaces.filter(space => categories.sodas.some(cat => space.building.includes(cat))),
            amenidades: spaces.filter(space => categories.amenidades.some(cat => space.building.includes(cat))),
            museos: spaces.filter(space => categories.museos.some(cat => space.building.includes(cat))),
            monumentos: spaces.filter(space => categories.monumentos.some(cat => space.building.includes(cat)))
        };
    };

    // Calculate categorized spaces
    const categorizedSpaces = categorizeSpaces();

    // Data for pie chart
    const pieData = [
        { name: 'Disponible', value: spaces.reduce((acc, space) => acc + (space.capacity - space.currentOccupancy), 0) },
        { name: 'Ocupado', value: spaces.reduce((acc, space) => acc + space.currentOccupancy, 0) }
    ];

    // Initialize hourly data and visible lines
    useEffect(() => {
        if (spaces.length > 0) {
            const data = generateHourlyData(spaces);
            setHourlyData(data);

            // Initialize all lines as visible
            const initialVisibleLines: { [key: string]: boolean } = {};
            spaces.forEach(space => {
                const spaceKey = space.name.toLowerCase().replace(/\s+/g, '_');
                initialVisibleLines[spaceKey] = true;
            });
            setVisibleLines(initialVisibleLines);
        }
    }, [spaces]);

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
                // If we get data back, use it, otherwise keep using mock data
                if (data && data.length > 0) {
                    setSpaces(data);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch spaces', err);
                setError('Failed to fetch spaces data. Using mock data instead.');
            }
        };

        getSpaces();
    }, []);

    // Simulate loading delay for demo purposes
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <DashboardContext.Provider
            value={{
                spaces,
                loading,
                error,
                hourlyData,
                visibleLines,
                categorizedSpaces,
                pieData,
                toggleLineVisibility
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