import HourlyData from '/opt/render/project/src/api/src/models/HourlyData.js';

// Get hourly data for the current day (default)
export const getHourlyData = async (req, res) => {
  try {
    const { date } = req.query;
    let queryDate;
    
    if (date) {
      // If date is provided as query parameter, use it
      queryDate = new Date(date);
    } else {
      // Otherwise use current date
      queryDate = new Date();
    }
    
    // Set to beginning of the day
    queryDate.setHours(0, 0, 0, 0);
    
    // Set the end date to the end of the day
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);
    
    // Query for hourly data within the date range
    const hourlyData = await HourlyData.find({
      date: {
        $gte: queryDate,
        $lte: endDate
      }
    }).sort({ date: 1 });
    
    res.status(200).json(hourlyData);
  } catch (error) {
    console.error('Error fetching hourly data:', error);
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// Get hourly data for a specific date range
export const getHourlyDataRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'Start date and end date are required' });
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set to beginning and end of days
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Query for hourly data within the date range
    const hourlyData = await HourlyData.find({
      date: {
        $gte: start,
        $lte: end
      }
    }).sort({ date: 1 });
    
    res.status(200).json(hourlyData);
  } catch (error) {
    console.error('Error fetching hourly data range:', error);
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// Get the latest hourly data for charts (similar to what generateHourlyData was doing)
export const getLatestHourlyData = async (req, res) => {
  try {
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Query for today's hourly data
    const hourlyData = await HourlyData.find({
      date: {
        $gte: today
      }
    }).sort({ date: 1 });
    
    // Format data similar to generateHourlyData output
    const formattedData = hourlyData.map(record => {
      const dataPoint = { hour: record.hour };
      
      // Add each space's percentage to the data point
      record.spaceData.forEach((percentage, spaceKey) => {
        dataPoint[spaceKey] = percentage;
      });
      
      return dataPoint;
    });
    
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching latest hourly data:', error);
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};