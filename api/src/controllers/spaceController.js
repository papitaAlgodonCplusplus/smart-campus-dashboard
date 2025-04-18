import Space from '/opt/render/project/src/api/src/models/Space.js'

// Get all spaces
export const getSpaces = async (req, res) => {
  try {
    
    const spaces = await Space.find({});
    
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

// Get space by ID
export const getSpaceById = async (req, res) => {
  try {
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