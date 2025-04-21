import Space from '/opt/render/project/src/api/src/models/Space.js'
import mongoose from 'mongoose';

// Get all spaces
export const getSpaces = async (req, res) => {
  try {
    console.log('Fetching all spaces...');
    
    // Log connection info
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    console.log('Querying collection:', Space.collection.collectionName);
    
    // Log the count first to confirm if there are documents
    const count = await Space.countDocuments({});
    console.log('Found document count:', count);
    
    const spaces = await Space.find({});
    console.log('Spaces found:', spaces.length);
    
    res.status(200).json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

// Get space by ID
export const getSpaceById = async (req, res) => {
  try {
    console.log('Fetching space by ID...');
    const space = await Space.findById(req.params.id);
    if (!space) {
      res.status(404).json({ message: 'Space not found' });
      return;
    }
    res.status(200).json(space);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

// Update space occupancy
export const updateOccupancy = async (req, res) => {
  try {
    console.log('Updating space occupancy...');
    const { currentOccupancy } = req.body;
    
    const space = await Space.findById(req.params.id);
    if (!space) {
      res.status(404).json({ message: 'Space not found' });
      return;
    }
    
    space.currentOccupancy = currentOccupancy;
    space.lastUpdated = new Date();
    
    const updatedSpace = await space.save();
    res.status(200).json(updatedSpace);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};