
// These are the coordinate transformations from Leaflet to 3D Space
export const CAMPUS_CONSTANTS = {
    // Center of the campus
    CENTER_LAT: 9.938,
    CENTER_LNG: -84.05,

    // Transformation functions
    transformCoordinates: (lat, lng) => {
        return [
            (lng - (-84.05)) * 10000, // X (longitude)
            0, // Y (height)
            (lat - 9.94) * 10000 // Z (latitude)
        ];
    },

    // Time of day settings
    DEFAULT_TIME: 25, // Default to noon (25)

    // Camera settings
    DEFAULT_CAMERA: {
        position: [30, 30, 30],
        fov: 60
    }
};