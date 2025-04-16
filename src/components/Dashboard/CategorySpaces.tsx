import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button
} from '@mui/material';
import SpaceOccupancy from './SpaceOccupancy';
import { Space } from './DashboardContext';

interface CategorySpacesProps {
  categoryName: string;
  spaces: Space[];
}

const CategorySpaces: React.FC<CategorySpacesProps> = ({ categoryName, spaces }) => {
  const navigate = useNavigate();

  if (spaces.length === 0) return null;

  // Navigate to map with selected space
  const handleViewInMap = (space: Space) => {
    if (space?.position) {
      // Navigate to map page and pass location in URL params
      navigate(`/map?lat=${space.position[0]}&lng=${space.position[1]}&name=${space.name}`);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        {categoryName}
      </Typography>

      <Grid container spacing={2} sx={{ color: 'white' }}>
        {spaces.map((space) => (
          <Grid container key={space._id}>
            <Box sx={{ position: 'relative' }}>
              <SpaceOccupancy
                name={space.name}
                currentOccupancy={space.currentOccupancy}
                maxCapacity={space.capacity}
                sx={{ color: 'white' }}
              />
              {space.position && (
                <Button
                  size="small"
                  onClick={() => handleViewInMap(space)}
                  sx={{
                    position: 'absolute',
                    right: '-5px',
                    top: '4px',
                    fontSize: '20px',
                  }}
                >
                  🌎
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySpaces;