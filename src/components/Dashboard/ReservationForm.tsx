import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDashboard } from './DashboardContext';
import { Space } from './DashboardContext';
import { ReservationFormData } from '../../types/ReservationTypes';
import { format, addDays } from 'date-fns';

// Define time options for the form
const timeOptions = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const ReservationForm: React.FC = () => {
  const { spaces, addReservation, isTimeSlotAvailable } = useDashboard();

  // Form state
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('11:00');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');

  // Validation state
  const [spacesError, setSpacesError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<boolean>(false);
  const [userNameError, setUserNameError] = useState<boolean>(false);
  const [timeConflictError, setTimeConflictError] = useState<boolean>(false);

  // Feedback state
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Filter time options based on selection
  const availableStartTimes = timeOptions.slice(0, -1); // All but last
  const availableEndTimes = startTime
    ? timeOptions.filter(time => time > startTime)
    : [];

  // Reset end time if invalid after start time change
  useEffect(() => {
    if (startTime && endTime && startTime >= endTime) {
      const startIndex = timeOptions.findIndex(t => t === startTime);
      if (startIndex < timeOptions.length - 1) {
        setEndTime(timeOptions[startIndex + 1]);
      }
    }
  }, [startTime, endTime]);

  // Handle changes
  const handleSpacesChange = (_event: React.SyntheticEvent, value: Space[]) => {
    setSelectedSpaces(value.map(space => space._id));
    setSpacesError(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setDateError(false);

    // Check for time conflicts with new date
    validateTimeConflicts(date, selectedSpaces, startTime, endTime);
  };

  const handleStartTimeChange = (event: SelectChangeEvent) => {
    const newStartTime = event.target.value;
    setStartTime(newStartTime);
    setTimeError(false);

    // Adjust end time if necessary
    if (newStartTime >= endTime) {
      const startIndex = timeOptions.findIndex(t => t === newStartTime);
      if (startIndex < timeOptions.length - 1) {
        setEndTime(timeOptions[startIndex + 1]);
      }
    }

    // Check for time conflicts
    validateTimeConflicts(selectedDate, selectedSpaces, newStartTime, endTime);
  };

  const handleEndTimeChange = (event: SelectChangeEvent) => {
    const newEndTime = event.target.value;
    setEndTime(newEndTime);
    setTimeError(false);

    // Check for time conflicts
    validateTimeConflicts(selectedDate, selectedSpaces, startTime, newEndTime);
  };

  const handleAnonymousChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnonymous(event.target.checked);
    if (event.target.checked) {
      setUserName('');
      setUserNameError(false);
    }
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    setUserNameError(!event.target.value.trim() && !isAnonymous);
  };

  // Validate time conflicts
  const validateTimeConflicts = (
    date: Date | null,
    spaceIds: string[],
    start: string,
    end: string
  ) => {
    if (!date || spaceIds.length === 0 || !start || !end) {
      setTimeConflictError(false);
      return true;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');

    // Check each selected space for conflicts
    const conflicts = spaceIds.some(spaceId =>
      !isTimeSlotAvailable(spaceId, formattedDate, start, end)
    );

    setTimeConflictError(conflicts);
    return !conflicts;
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate required fields
    let isValid = true;

    if (selectedSpaces.length === 0) {
      setSpacesError(true);
      isValid = false;
    }

    if (!selectedDate) {
      setDateError(true);
      isValid = false;
    }

    if (!startTime || !endTime || startTime >= endTime) {
      setTimeError(true);
      isValid = false;
    }

    if (!isAnonymous && !userName.trim()) {
      setUserNameError(true);
      isValid = false;
    }

    // Check for time conflicts
    if (!validateTimeConflicts(selectedDate, selectedSpaces, startTime, endTime)) {
      isValid = false;
    }

    if (!isValid) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Por favor corrija los errores en el formulario.');
      setSnackbarOpen(true);
      return;
    }

    // Create reservation data
    const formData: ReservationFormData = {
      spaces: selectedSpaces,
      date: format(selectedDate!, 'yyyy-MM-dd'),
      startTime,
      endTime,
      isAnonymous,
      userName: isAnonymous ? 'Anónimo' : userName,
    };

    // Add reservation
    addReservation(formData);

    // Show success message
    setSnackbarSeverity('success');
    setSnackbarMessage('Reserva creada exitosamente.');
    setSnackbarOpen(true);

    // Reset form
    setSelectedSpaces([]);
    setStartTime('09:00');
    setEndTime('11:00');
    setIsAnonymous(true);
    setUserName('');
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        Crear Nueva Reserva
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Space Selection */}
          <Grid container>
            <Autocomplete
              multiple
              id="space-selection"
              options={spaces}
              getOptionLabel={(option) => `${option.name} (${option.building})`}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={handleSpacesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar Espacios"
                  error={spacesError}
                  helperText={spacesError ? "Debe seleccionar al menos un espacio" : ""}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'var(--neon-primary)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--neon-primary)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--neon-primary)',
                      },
                    },
                    '& .MuiFormLabel-root': {
                      color: 'var(--neon-primary)',
                    },
                    'width': '20vw',
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{
                      backgroundColor: 'var(--neon-primary)',
                      color: 'black',
                      '& .MuiChip-deleteIcon': {
                        color: 'black',
                      },
                    }}
                  />
                ))
              }
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Date Selection */}
          <Grid container>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha de Reserva"
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
                maxDate={addDays(new Date(), 30)} // Only allow reservations up to 30 days in advance
                slotProps={{
                  textField: {
                    error: dateError,
                    helperText: dateError ? "Debe seleccionar una fecha válida" : "",
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--neon-primary)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--neon-primary)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--neon-primary)',
                        },
                      },
                      '& .MuiFormLabel-root': {
                        color: 'var(--neon-primary)',
                      },
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Time Selection */}
          <Grid container>
            <FormControl fullWidth error={timeError} sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--neon-primary)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--neon-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--neon-primary)',
                },
              },
              '& .MuiFormLabel-root': {
                color: 'var(--neon-primary)',
              },
            }}>
              <InputLabel id="start-time-label">Hora Inicio</InputLabel>
              <Select
                labelId="start-time-label"
                id="start-time"
                value={startTime}
                label="Hora Inicio"
                onChange={handleStartTimeChange}
              >
                {availableStartTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
              {timeError && (
                <Typography variant="caption" color="error">
                  Horario inválido
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid container>
            <FormControl fullWidth error={timeError} sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--neon-primary)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--neon-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--neon-primary)',
                },
              },
              '& .MuiFormLabel-root': {
                color: 'var(--neon-primary)',
              },
            }}>
              <InputLabel id="end-time-label">Hora Fin</InputLabel>
              <Select
                labelId="end-time-label"
                id="end-time"
                value={endTime}
                label="Hora Fin"
                onChange={handleEndTimeChange}
                disabled={!startTime}
              >
                {availableEndTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Anonymous Checkbox */}
          <Grid container>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAnonymous}
                    onChange={handleAnonymousChange}
                    sx={{
                      color: 'var(--neon-primary)',
                      '&.Mui-checked': {
                        color: 'var(--neon-primary)',
                      },
                    }}
                  />
                }
                label="Reservar anónimamente"
              />
            </FormGroup>
          </Grid>

          {/* User Name (if not anonymous) */}
          {!isAnonymous && (
            <Grid container>
              <TextField
                fullWidth
                id="user-name"
                label="Nombre del Usuario"
                value={userName}
                onChange={handleUserNameChange}
                error={userNameError}
                helperText={userNameError ? "Debe ingresar su nombre" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--neon-primary)',
                    },
                  },
                  '& .MuiFormLabel-root': {
                    color: 'var(--neon-primary)',
                  },
                }}
              />
            </Grid>
          )}

          {/* Time Conflict Warning */}
          {timeConflictError && (
            <Grid container>
              <Alert severity="error" sx={{ mb: 2 }}>
                Existe un conflicto con otra reserva en el horario seleccionado. Por favor seleccione otro horario.
              </Alert>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid container>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: 'var(--neon-primary)',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'var(--neon-blue)',
                  boxShadow: '0 0 15px var(--neon-blue)',
                },
              }}
            >
              Crear Reserva
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ReservationForm;