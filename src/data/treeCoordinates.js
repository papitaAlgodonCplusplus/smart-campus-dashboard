// TREES COORDINATES
const coordinates = [

  // Trees near Library (Biblioteca Carlos Monge Alfaro) - ID 1: [9.936058, -84.051060]
  { position: [-40, -0.5, 40], scale: 1.2 }, // Original, keep
  { position: [-36, -0.5, 36], scale: 0.9 }, // Original, keep
  { position: [-42, -0.5, 45], scale: 1.1 }, // Adjusted
  { position: [-37, -0.5, 30], scale: 0.8 }, // Adjusted
  { position: [-32, -0.5, 35], scale: 1.0 }, // Adjusted

  // Trees near Education Faculty - ID 2: [9.936004, -84.048674]
  { position: [20, -0.5, 35], scale: 1.3 }, // Adjusted
  { position: [25, -0.5, 30], scale: 1.0 }, // Adjusted
  { position: [18, -0.5, 32], scale: 0.9 }, // Adjusted

  // Trees near Engineering Faculty - ID 7: [9.936173, -84.051970]
  { position: [-30, -0.5, -15], scale: 1.2 }, // Adjusted
  { position: [-28, -0.5, -20], scale: 1.0 }, // Adjusted
  { position: [-35, -0.5, -18], scale: 0.8 }, // Adjusted

  // Trees near Faculty of Education - adjusted to ID 2 coordinates
  { position: [15, -0.5, 30], scale: 1.0 }, // Adjusted
  { position: [20, -0.5, 40], scale: 1.1 }, // Adjusted
  { position: [17, -0.5, 38], scale: 0.9 }, // Adjusted

  // Trees near Letters Faculty - ID 6: [9.938592, -84.052863]
  { position: [-60, -0.5, -55], scale: 1.2 }, // Adjusted
  { position: [-55, -0.5, -60], scale: 1.0 }, // Adjusted

  // Trees near Cafeteria/Comedor Estudiantil - ID 3: [9.937167, -84.053081]
  { position: [-50, -0.5, 45], scale: 1.1 }, // Adjusted
  { position: [-45, -0.5, 48], scale: 0.9 }, // Adjusted
  { position: [-47, -0.5, 43], scale: 1.0 }, // Added for Comedor
  { position: [-52, -0.5, 47], scale: 0.8 }, // Added for Comedor
  { position: [-48, -0.5, 50], scale: 1.2 }, // Added for Comedor

  // Trees near General Studies - ID 4: [9.936153, -84.050379]
  { position: [-18, -0.5, 10], scale: 1.0 }, // Adjusted
  { position: [-15, -0.5, 8], scale: 1.2 }, // Adjusted
  { position: [-12, -0.5, 12], scale: 0.8 }, // Adjusted

  // Trees around Ciencias Económicas - ID 8: [9.937149, -84.051689]
  { position: [-28, -0.5, 15], scale: 0.9 }, // Adjusted
  { position: [-25, -0.5, 20], scale: 0.8 }, // Adjusted
  { position: [-22, -0.5, 17], scale: 0.9 }, // Adjusted

  // Trees around Medicina - ID 11: [9.938594, -84.050590]
  { position: [-18, -0.5, -30], scale: 0.8 }, // Adjusted
  { position: [-15, -0.5, -35], scale: 0.9 }, // Adjusted
  { position: [-20, -0.5, -32], scale: 0.8 }, // Adjusted

  // Trees around Escuela de Química - ID 12: [9.937249, -84.048989]
  { position: [10, -0.5, 15], scale: 0.9 }, // Adjusted
  { position: [7, -0.5, 18], scale: 1.0 }, // Adjusted
  { position: [12, -0.5, 20], scale: 0.9 }, // Adjusted

  // Trees around Facultad de Bellas Artes - ID 14: [9.936598, -84.048422]
  { position: [20, -0.5, 25], scale: 1.0 }, // Adjusted
  { position: [25, -0.5, 28], scale: 1.1 }, // Adjusted

  // Trees around Escuela de Artes Musicales - ID 15: [9.937429, -84.048234]
  { position: [25, -0.5, 15], scale: 0.9 }, // Adjusted
  { position: [28, -0.5, 12], scale: 1.0 }, // Adjusted

  // Trees around Facultad de Farmacia - ID 16: [9.938940, -84.049794]
  { position: [5, -0.5, -50], scale: 1.1 }, // Adjusted
  { position: [8, -0.5, -45], scale: 1.2 }, // Adjusted

  // Trees around Microbiología - ID 17: [9.938047, -84.049196]
  { position: [10, -0.5, -30], scale: 1.0 }, // Adjusted
  { position: [7, -0.5, -25], scale: 0.9 }, // Adjusted

  // Trees around Arquitectura - ID 19: [9.934783, -84.052608]
  { position: [-55, -0.5, 70], scale: 1.1 }, // Adjusted
  { position: [-50, -0.5, 75], scale: 1.0 }, // Adjusted

  // Trees around Centro de Informática - ID 21: [9.937736, -84.052048]
  { position: [-35, -0.5, -15], scale: 0.9 }, // Adjusted
  { position: [-32, -0.5, -18], scale: 1.0 }, // Adjusted
  { position: [-38, -0.5, -12], scale: 1.1 }, // Added for Informática
  { position: [-35, -0.5, -10], scale: 0.8 }, // Added for Informática
  { position: [-30, -0.5, -13], scale: 1.0 }, // Added for Informática

  // Trees around FEUCR - ID 47: [9.937351, -84.053294]
  { position: [-55, -0.5, 25], scale: 1.2 }, // Added for FEUCR
  { position: [-53, -0.5, 28], scale: 0.9 }, // Added for FEUCR
  { position: [-57, -0.5, 30], scale: 1.0 }, // Added for FEUCR
  { position: [-52, -0.5, 32], scale: 1.1 }, // Added for FEUCR

  // Trees around ECCI - ID 22: [9.937967, -84.051959]
  { position: [-33, -0.5, -25], scale: 1.0 }, // Added for ECCI
  { position: [-36, -0.5, -23], scale: 0.9 }, // Added for ECCI
  { position: [-32, -0.5, -28], scale: 1.1 }, // Added for ECCI

  // Trees around Derecho - ID 9: [9.936368, -84.053911]
  { position: [-65, -0.5, 40], scale: 1.1 }, // Added for Derecho
  { position: [-62, -0.5, 43], scale: 0.9 }, // Added for Derecho
  { position: [-68, -0.5, 45], scale: 1.0 }, // Added for Derecho

  // Trees around Biblioteca Luis Demetrio Tinoco - ID 10: [9.936010, -84.052726]
  { position: [-48, -0.5, 30], scale: 1.0 }, // Added for Biblioteca Tinoco
  { position: [-45, -0.5, 32], scale: 0.9 }, // Added for Biblioteca Tinoco
  { position: [-50, -0.5, 35], scale: 1.1 }, // Added for Biblioteca Tinoco

  // Trees around Red Sismológica Nacional - ID 39: [9.9380336, -84.052239]
  { position: [-45, -0.5, -40], scale: 0.9 }, // Added for Red Sismológica
  { position: [-42, -0.5, -43], scale: 1.0 }, // Added for Red Sismológica

  // Trees around Ciencias Agroalimentarias - ID 27: [9.939027, -84.048140]
  { position: [20, -0.5, -55], scale: 1.2 }, // Added for Agroalimentarias
  { position: [25, -0.5, -58], scale: 1.0 }, // Added for Agroalimentarias
  { position: [18, -0.5, -60], scale: 0.9 }, // Added for Agroalimentarias
  { position: [22, -0.5, -62], scale: 1.1 }, // Added for Agroalimentarias

  // Trees around Teatro Universitario - ID 30: [9.9351473, -84.0505921]
  { position: [-25, -0.5, 55], scale: 1.0 }, // Added for Teatro
  { position: [-28, -0.5, 52], scale: 0.9 }, // Added for Teatro

  // Trees around Bienestar y Salud - ID 24: [9.935158, -84.052424]
  { position: [-45, -0.5, 60], scale: 0.9 }, // Added for Bienestar y Salud
  { position: [-42, -0.5, 58], scale: 1.0 }, // Added for Bienestar y Salud

  // Trees around Butterfly Garden - ID 43: [9.9370255, -84.050435]
  { position: [-20, -0.5, 0], scale: 1.2 }, // Added for Butterfly Garden
  { position: [-18, -0.5, 4], scale: 1.0 }, // Added for Butterfly Garden
  { position: [-22, -0.5, -2], scale: 0.9 }, // Added for Butterfly Garden
  { position: [-17, -0.5, -5], scale: 1.1 }, // Added for Butterfly Garden

  // Trees around the central fountain area
  { position: [5, -0.5, 5], scale: 1.0 }, // Near center
  { position: [-5, -0.5, -5], scale: 1.1 }, // Near center
  { position: [8, -0.5, -8], scale: 0.9 }, // Added near center
  { position: [-8, -0.5, 8], scale: 1.0 }, // Added near center


  // Additional trees between -75 and -125 x and -8 to 60 z
  { position: [-65, -0.5, 60], scale: 0.9 },
  { position: [-82, -0.5, 58], scale: 1.0 }, 
  { position: [-65, -0.5, 60], scale: 0.9 },
  { position: [-82, -0.5, 58], scale: 1.0 },
  { position: [-80, -0.5, 10], scale: 1.1 },
  { position: [-85, -0.5, 20], scale: 0.9 },
  { position: [-90, -0.5, 30], scale: 1.0 },
  { position: [-95, -0.5, 40], scale: 1.2 },
  { position: [-100, -0.5, 50], scale: 0.8 },
  { position: [-105, -0.5, 25], scale: 1.0 },
  { position: [-110, -0.5, 15], scale: 1.1 },
  { position: [-115, -0.5, 5], scale: 0.9 },
  { position: [-120, -0.5, -5], scale: 1.0 },
  { position: [-125, -0.5, 0], scale: 1.2 },
  { position: [-130, -0.5, -10], scale: 0.8 },
  { position: [-135, -0.5, -20], scale: 1.0 },
  { position: [-140, -0.5, -30], scale: 1.1 },
  { position: [-145, -0.5, -40], scale: 0.9 },
  { position: [-150, -0.5, -50], scale: 1.2 },
  { position: [-155, -0.5, -60], scale: 0.8 },
  { position: [-160, -0.5, -70], scale: 1.0 },
  
  // Route 2
  { position: [-115, -0.5, 15], scale: 0.9 },
  { position: [-105, -0.5, 5], scale: 0.9 },
  { position: [-95, -0.5, -5], scale: 1.0 },
  { position: [-85, -0.5, -15], scale: 1.1 },
  { position: [-75, -0.5, -25], scale: 1.2 },
  { position: [-65, -0.5, -35], scale: 0.8 },
  { position: [-55, -0.5, -45], scale: 1.0 },
  { position: [-45, -0.5, -55], scale: 1.1 },

  // Route 3
  { position: [-115, -0.5, 5], scale: 0.9 },
  { position: [-105, -0.5, -5], scale: 1.0 },
  { position: [-100, -0.5, -15], scale: 1.1 },
  { position: [-95, -0.5, -25], scale: 1.2 },
  { position: [-90, -0.5, -35], scale: 0.8 },
  { position: [-85, -0.5, -45], scale: 1.0 },
  { position: [-75, -0.5, -65], scale: 1.2 },

  // Route 4
  { position: [-115, -0.5, -5], scale: 1.0 },
  { position: [-105, -0.5, -15], scale: 1.1 },
  { position: [-95, -0.5, -25], scale: 1.2 },
  { position: [-85, -0.5, -35], scale: 0.8 },
  { position: [-75, -0.5, -45], scale: 1.0 },
  { position: [-65, -0.5, -55], scale: 1.2 },

  // Random corner
  { position: [-135, -0.5, 60], scale: 0.9 },
  { position: [-140, -0.5, 40], scale: 1.0 },
  { position: [-135, -0.5, 70], scale: 1.1 },
  { position: [-120, -0.5, 50], scale: 1.2 },
  { position: [-125, -0.5, 20], scale: 0.8 },

];

export const treeCoordinates = coordinates.map(tree => ({
  ...tree,
  position: [tree.position[0], tree.position[1], tree.position[2] - 100],
}));