// These are the coordinate transformations from Leaflet to 3D Space
export const CAMPUS_CONSTANTS = {
    // Center of the campus (updated based on the new data)
    CENTER_LAT: 9.93800,
    CENTER_LNG: -84.05050,

    // Transformation functions
    transformCoordinates: (lat, lng) => {
        return [
            (lng - (-84.05050)) * 10000, // X (longitude)
            0, // Y (height)
            (lat - 9.93800) * 10000 // Z (latitude)
        ];
    },

    // Time of day settings
    DEFAULT_TIME: 25, // Default to noon (25)

    // Camera settings
    DEFAULT_CAMERA: {
        position: [-200, -300, -350],
        fov: 60
    }
};