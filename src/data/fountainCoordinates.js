

// FOUNTAIN COORDINATES
export const coordinates = [

    // Near Library (Biblioteca Carlos Monge Alfaro) - ID 1: [9.936058, -84.051060]
    { position: [-40, -0.2, 35] }, // Adjusted

    // Near Engineering Faculty - ID 7: [9.936173, -84.051970]
    { position: [-32, -0.2, -22] }, // Adjusted

    // Near Ciencias Económicas - ID 8: [9.937149, -84.051689]
    { position: [-30, -0.2, 20] }, // Adjusted

    // Near Letters Faculty - ID 6: [9.938592, -84.052863]
    { position: [-58, -0.2, -60] }, // Adjusted

    // Near Medicina - ID 11: [9.938594, -84.050590]
    { position: [-20, -0.2, -35] }, // New 

    // Near Facultad de Farmacia - ID 16: [9.938940, -84.049794]
    { position: [0, -0.2, -45] }, // New

    // Near Butterfly Garden - ID 43: [9.9370255, -84.050435]
    { position: [-18, -0.2, 0] }, // New
];

export const fountainCoordinates = coordinates.map(fountain => ({
  ...fountain,
  position: [fountain.position[0], fountain.position[1], fountain.position[2]-100],
}));
