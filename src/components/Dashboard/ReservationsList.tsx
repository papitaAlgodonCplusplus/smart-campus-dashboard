import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useDashboard } from './DashboardContext';
import { Reservation } from '../../types/ReservationTypes';
import { format, parseISO } from 'date-fns';

const ReservationsList: React.FC = () => {
  const { reservations, deleteReservation, spaces } = useDashboard();

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setReservationToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (reservationToDelete) {
      deleteReservation(reservationToDelete);
      setReservationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setReservationToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Filter reservations based on search term
  const filteredReservations = reservations.filter((reservation) => {
    const searchableText = `${reservation.spaceName} ${reservation.date} ${reservation.startTime} ${reservation.endTime} ${reservation.userName || 'Anónimo'}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  // Sort reservations by date and time (most recent first)
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    // First compare by date
    const dateA = a.date;
    const dateB = b.date;
    const dateCompare = dateB.localeCompare(dateA);
    
    if (dateCompare !== 0) return dateCompare;
    
    // If same date, compare by start time
    return b.startTime.localeCompare(a.startTime);
  });

  // Paginate
  const paginatedReservations = sortedReservations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Get space details
  const getSpaceDetails = (spaceId: string) => {
    return spaces.find(space => space._id === spaceId);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: 'rgba(5, 5, 25, 0.8)',
        backdropFilter: 'blur(5px)',
        border: '1px solid var(--neon-primary)',
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
        borderRadius: '8px',
        mb: 4
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: 'var(--neon-primary)', pb: 2 }}>
        <Badge
          badgeContent={reservations.length}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'var(--neon-primary)',
              color: 'black'
            }
          }}
        >
          <Box sx={{ mr: 3 }}>Reservaciones Actuales</Box>
        </Badge>
      </Typography>

      {/* Search field */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar reservas..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'var(--neon-primary)' }} />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--neon-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--neon-primary)',
              borderWidth: '2px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--neon-primary)',
              boxShadow: '0 0 5px var(--neon-primary)',
            },
          }
        }}
      />

      {reservations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No hay reservas registradas. Crea una nueva reserva para comenzar.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              maxHeight: 440,
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'var(--neon-primary)',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--neon-primary)',
                      fontWeight: 'bold'
                    }}
                  >
                    Espacio
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--neon-primary)',
                      fontWeight: 'bold'
                    }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--neon-primary)',
                      fontWeight: 'bold'
                    }}
                  >
                    Horario
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--neon-primary)',
                      fontWeight: 'bold'
                    }}
                  >
                    Usuario
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--neon-primary)',
                      fontWeight: 'bold'
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReservations.map((reservation) => {
                  const space = getSpaceDetails(reservation.spaceId);
                  
                  return (
                    <TableRow
                      key={reservation.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon
                            sx={{ mr: 1, color: 'var(--neon-primary)' }}
                          />
                          <Tooltip title={space?.building || ''} arrow>
                            <Typography variant="body2">
                              {reservation.spaceName}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon
                            sx={{ mr: 1, color: 'var(--neon-blue)' }}
                          />
                          <Typography variant="body2">
                            {formatDate(reservation.date)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon
                            sx={{ mr: 1, color: 'var(--neon-green)' }}
                          />
                          <Typography variant="body2">
                            {reservation.startTime} - {reservation.endTime}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon
                            sx={{ mr: 1, color: 'var(--neon-orange)' }}
                          />
                          {reservation.isAnonymous ? (
                            <Chip
                              label="Anónimo"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 136, 0, 0.2)',
                                border: '1px solid var(--neon-orange)',
                                color: 'var(--neon-orange)'
                              }}
                            />
                          ) : (
                            <Typography variant="body2">
                              {reservation.userName}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Eliminar reserva" arrow>
                          <IconButton
                            onClick={() => handleDeleteClick(reservation.id)}
                            sx={{
                              color: 'var(--neon-red)',
                              '&:hover': {
                                backgroundColor: 'rgba(240, 136, 0, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredReservations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: 'white',
              '& .MuiTablePagination-select': {
                color: 'white'
              },
              '& .MuiTablePagination-selectIcon': {
                color: 'var(--neon-primary)'
              },
              '& .MuiTablePagination-actions': {
                color: 'var(--neon-primary)'
              }
            }}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(5, 5, 25, 0.9)',
            border: '1px solid var(--neon-primary)',
            boxShadow: '0 0 15px var(--neon-primary)',
            borderRadius: '8px',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--neon-primary)' }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white' }}>
            ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: 'white',
              '&:hover': {
                color: 'var(--neon-primary)'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: 'var(--neon-red)',
              '&:hover': {
                backgroundColor: 'rgba(240, 136, 0, 0.1)',
                color: 'var(--neon-red)'
              }
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReservationsList;