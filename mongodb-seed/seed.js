import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

// ES module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the Space model schema directly in this file for seeding purposes
const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  position: { type: [Number], index: '2dsphere' }
});

// Create the Space model
const Space = mongoose.model('Space', spaceSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcampus');
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed data
const spaces = [
  {
    name: 'Biblioteca Carlos Monge Alfaro', 
    building: 'Biblioteca', 
    floor: 1, 
    capacity: 500, 
    currentOccupancy: 237, 
    lastUpdated: new Date(), 
    position: [9.936058, -84.051060]
  },
  { 
    name: 'Facultad de Educación', 
    building: 'Educación', 
    floor: 1, 
    capacity: 300, 
    currentOccupancy: 142, 
    lastUpdated: new Date(), 
    position: [9.936004, -84.048674]
  },
  { 
    name: 'Comedor Estudiantil', 
    building: 'Comedor', 
    floor: 1, 
    capacity: 400, 
    currentOccupancy: 318, 
    lastUpdated: new Date(), 
    position: [9.937167, -84.053081]
  },
  { 
    name: 'Escuela de Estudios Generales', 
    building: 'Estudios Generales', 
    floor: 1, 
    capacity: 600, 
    currentOccupancy: 481, 
    lastUpdated: new Date(), 
    position: [9.936153, -84.050379]
  },
  { 
    name: 'Edificio de Aulas (Antigua Facultad de Ciencias Sociales)', 
    building: 'Ciencias Sociales', 
    floor: 1, 
    capacity: 800, 
    currentOccupancy: 325, 
    lastUpdated: new Date(), 
    position: [9.936731, -84.050758]
  },
  { 
    name: 'Facultad de Letras', 
    building: 'Letras', 
    floor: 1, 
    capacity: 350, 
    currentOccupancy: 187, 
    lastUpdated: new Date(), 
    position: [9.938592, -84.052863]
  },
  { 
    name: 'Facultad de Ingeniería (Edificio antiguo)', 
    building: 'Ingeniería', 
    floor: 1, 
    capacity: 700, 
    currentOccupancy: 492, 
    lastUpdated: new Date(), 
    position: [9.936173, -84.051970]
  },
  { 
    name: 'Facultad de Ciencias Económicas', 
    building: 'Ciencias Económicas', 
    floor: 1, 
    capacity: 550, 
    currentOccupancy: 320, 
    lastUpdated: new Date(), 
    position: [9.937149, -84.051689]
  },
  { 
    name: 'Facultad de Derecho', 
    building: 'Derecho', 
    floor: 1, 
    capacity: 450, 
    currentOccupancy: 270, 
    lastUpdated: new Date(), 
    position: [9.936368, -84.053911]
  },
  { 
    name: 'Biblioteca Luis Demetrio Tinoco', 
    building: 'Biblioteca Tinoco', 
    floor: 1, 
    capacity: 480, 
    currentOccupancy: 230, 
    lastUpdated: new Date(), 
    position: [9.936010, -84.052726]
  },
  { 
    name: 'Facultad de Medicina', 
    building: 'Medicina', 
    floor: 1, 
    capacity: 700, 
    currentOccupancy: 410, 
    lastUpdated: new Date(), 
    position: [9.938594, -84.050590]
  },
  { 
    name: 'Escuela de Química', 
    building: 'Química', 
    floor: 1, 
    capacity: 400, 
    currentOccupancy: 220, 
    lastUpdated: new Date(), 
    position: [9.937249, -84.048989]
  },
  { 
    name: 'Escuela de Física y Matemática', 
    building: 'Física y Matemática', 
    floor: 1, 
    capacity: 350, 
    currentOccupancy: 180, 
    lastUpdated: new Date(), 
    position: [9.936491, -84.051588]
  },
  { 
    name: 'Facultad de Bellas Artes', 
    building: 'Bellas Artes', 
    floor: 1, 
    capacity: 300, 
    currentOccupancy: 190, 
    lastUpdated: new Date(), 
    position: [9.936598, -84.048422]
  },
  { 
    name: 'Escuela de Artes Musicales', 
    building: 'Artes Musicales', 
    floor: 1, 
    capacity: 250, 
    currentOccupancy: 135, 
    lastUpdated: new Date(), 
    position: [9.937429, -84.048234]
  },
  { 
    name: 'Facultad de Farmacia', 
    building: 'Farmacia', 
    floor: 1, 
    capacity: 380, 
    currentOccupancy: 210, 
    lastUpdated: new Date(), 
    position: [9.938940, -84.049794]
  },
  { 
    name: 'Facultad de Microbiología', 
    building: 'Microbiología', 
    floor: 1, 
    capacity: 320, 
    currentOccupancy: 175, 
    lastUpdated: new Date(), 
    position: [9.938047, -84.049196]
  },
  { 
    name: 'Biblioteca de Ciencias de la Salud', 
    building: 'Biblioteca Salud', 
    floor: 1, 
    capacity: 180, 
    currentOccupancy: 85, 
    lastUpdated: new Date(), 
    position: [9.938394, -84.051333]
  },
  { 
    name: 'Escuela de Arquitectura', 
    building: 'Arquitectura', 
    floor: 1, 
    capacity: 250, 
    currentOccupancy: 160, 
    lastUpdated: new Date(), 
    position: [9.934783, -84.052608]
  },
  { 
    name: 'Edificio Administrativo A', 
    building: 'Administrativo', 
    floor: 1, 
    capacity: 420, 
    currentOccupancy: 280, 
    lastUpdated: new Date(), 
    position: [9.935491, -84.054193]
  },
  { 
    name: 'Centro de Informática', 
    building: 'Informática', 
    floor: 1, 
    capacity: 150, 
    currentOccupancy: 95, 
    lastUpdated: new Date(), 
    position: [9.937736, -84.052048]
  },
  { 
    name: 'Escuela de Ciencias de la Computación e Informática', 
    building: 'ECCI', 
    floor: 1, 
    capacity: 280, 
    currentOccupancy: 190, 
    lastUpdated: new Date(), 
    position: [9.937967, -84.051959]
  },
  { 
    name: 'Escuela de Biología', 
    building: 'Biología', 
    floor: 1, 
    capacity: 300, 
    currentOccupancy: 170, 
    lastUpdated: new Date(), 
    position: [9.937612, -84.049506]
  },
  { 
    name: 'Oficina de Bienestar y Salud', 
    building: 'Bienestar y Salud', 
    floor: 1, 
    capacity: 120, 
    currentOccupancy: 65, 
    lastUpdated: new Date(), 
    position: [9.935158, -84.052424]
  },
  { 
    name: 'FEUCR', 
    building: 'Federación de Estudiantes', 
    floor: 1, 
    capacity: 80, 
    currentOccupancy: 35, 
    lastUpdated: new Date(), 
    position: [9.937351, -84.053294]
  },
  { 
    name: 'Auditorio Abelardo Bonilla', 
    building: 'Auditorio', 
    floor: 1, 
    capacity: 200, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.936408, -84.050290]
  },
  { 
    name: 'Facultad de Ciencias Agroalimentarias', 
    building: 'Agroalimentarias', 
    floor: 1, 
    capacity: 350, 
    currentOccupancy: 210, 
    lastUpdated: new Date(), 
    position: [9.939027, -84.048140]
  },
  { 
    name: 'Instituto Confucio', 
    building: 'Confucio', 
    floor: 1, 
    capacity: 120, 
    currentOccupancy: 60, 
    lastUpdated: new Date(), 
    position: [9.934765, -84.052973]
  },
  { 
    name: 'Museo de Insectos', 
    building: 'Museo', 
    floor: 1, 
    capacity: 80, 
    currentOccupancy: 35, 
    lastUpdated: new Date(), 
    position: [9.9375461, -84.0480803]
  },
  { 
    name: 'Teatro Universitario', 
    building: 'Teatro', 
    floor: 1, 
    capacity: 250, 
    currentOccupancy: 120, 
    lastUpdated: new Date(), 
    position: [9.9351473, -84.0505921]
  },
  { 
    name: 'Museo Integral de Cultura e Identidad Nacional', 
    building: 'Museo CIICLA', 
    floor: 1, 
    capacity: 100, 
    currentOccupancy: 40, 
    lastUpdated: new Date(), 
    position: [9.9387108, -84.0526236]
  },
  { 
    name: 'Soda de Generales', 
    building: 'Soda', 
    floor: 1, 
    capacity: 150, 
    currentOccupancy: 90, 
    lastUpdated: new Date(), 
    position: [9.9360374, -84.0504853]
  },
  { 
    name: 'Soda de Educación', 
    building: 'Soda', 
    floor: 1, 
    capacity: 120, 
    currentOccupancy: 70, 
    lastUpdated: new Date(), 
    position: [9.9362101, -84.048928]
  },
  { 
    name: 'Soda de Económicas', 
    building: 'Soda', 
    floor: 1, 
    capacity: 130, 
    currentOccupancy: 75, 
    lastUpdated: new Date(), 
    position: [9.9373607, -84.0519182]
  },
  { 
    name: 'Soda de Agroalimentarias', 
    building: 'Soda', 
    floor: 1, 
    capacity: 100, 
    currentOccupancy: 55, 
    lastUpdated: new Date(), 
    position: [9.9389716, -84.0484428]
  },
  { 
    name: 'Soda de Farmacia', 
    building: 'Soda', 
    floor: 1, 
    capacity: 80, 
    currentOccupancy: 45, 
    lastUpdated: new Date(), 
    position: [9.938747, -84.0496005]
  },
  { 
    name: 'Control de Ingreso Ciudad Universitaria', 
    building: 'Control', 
    floor: 1, 
    capacity: 20, 
    currentOccupancy: 10, 
    lastUpdated: new Date(), 
    position: [9.9365233, -84.0532717]
  },
  { 
    name: 'Centro de Asesoría Estudiantil', 
    building: 'Asesoría', 
    floor: 1, 
    capacity: 60, 
    currentOccupancy: 30, 
    lastUpdated: new Date(), 
    position: [9.9366332, -84.0488604]
  },
  { 
    name: 'Red Sismológica Nacional', 
    building: 'Red Sismológica', 
    floor: 1, 
    capacity: 40, 
    currentOccupancy: 25, 
    lastUpdated: new Date(), 
    position: [9.9380336, -84.052239]
  },
  { 
    name: 'CIICLA', 
    building: 'Centro de Investigación', 
    floor: 1, 
    capacity: 70, 
    currentOccupancy: 35, 
    lastUpdated: new Date(), 
    position: [9.9389097, -84.0527094]
  },
  { 
    name: 'Fuente de Cupido y el Cisne', 
    building: 'Espacio Común', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9357604, -84.0511821]
  },
  { 
    name: 'Sección de Correo - UCR', 
    building: 'Servicios', 
    floor: 1, 
    capacity: 30, 
    currentOccupancy: 15, 
    lastUpdated: new Date(), 
    position: [9.9349976, -84.0508776]
  },
  { 
    name: 'Butterfly Garden', 
    building: 'Jardín', 
    floor: 1, 
    capacity: 40, 
    currentOccupancy: 20, 
    lastUpdated: new Date(), 
    position: [9.9370255, -84.050435]
  },
  { 
    name: 'Centro de Investigación en Protección de Cultivos', 
    building: 'Investigación', 
    floor: 1, 
    capacity: 50, 
    currentOccupancy: 30, 
    lastUpdated: new Date(), 
    position: [9.9389959, -84.0480981]
  },
  { 
    name: 'Equipo de Migración a Software Libre', 
    building: 'Software Libre', 
    floor: 1, 
    capacity: 25, 
    currentOccupancy: 15, 
    lastUpdated: new Date(), 
    position: [9.9377169, -84.0523201]
  },
  { 
    name: 'Monumento a Rodrigo Facio Brenes', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9357298, -84.050846]
  },
  { 
    name: 'FEUCR', 
    building: 'Federación de Estudiantes', 
    floor: 2, 
    capacity: 80, 
    currentOccupancy: 40, 
    lastUpdated: new Date(), 
    position: [9.937351, -84.053294]
  },
  { 
    name: 'Monumento a Carlos Monge Alfaro', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9356051, -84.0512781]
  },
  { 
    name: 'Monumento XXV Aniversario de Ingeniería Eléctrica', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9356424, -84.0521828]
  },
  { 
    name: 'Soy UCR', 
    building: 'Monumento', 
    floor: 1, 
    capacity: 0, 
    currentOccupancy: 0, 
    lastUpdated: new Date(), 
    position: [9.9358579, -84.0514281]
  }
];

// Import the data
const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Space.deleteMany();
    
    
    // Insert new data
    await Space.insertMany(spaces);
    
    
    // Disconnect and exit
    await mongoose.disconnect();
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Execute the import
importData();