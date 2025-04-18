import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    spaceId: {
        type: Schema.Types.ObjectId,
        ref: 'Space',
        required: [true, 'Please provide a space ID']
    },
    spaceName: {
        type: String,
        required: [true, 'Please provide a space name']
    },
    date: {
        type: String,
        required: [true, 'Please provide a date'],
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid date! Format should be YYYY-MM-DD`
        }
    },
    startTime: {
        type: String,
        required: [true, 'Please provide a start time'],
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time! Format should be HH:MM`
        }
    },
    endTime: {
        type: String,
        required: [true, 'Please provide an end time'],
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time! Format should be HH:MM`
        }
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    userName: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient lookup of reservations by space and date
ReservationSchema.index({ spaceId: 1, date: 1 });

/**
 * Custom method to check if a time slot conflicts with this reservation
 * @param {string} date
 * @param {string} startTime
 * @param {string} endTime
 * @returns {boolean}
 */
ReservationSchema.methods.conflictsWith = function (date, startTime, endTime) {
    if (this.date !== date) return false;

    // Convert times to minutes for easier comparison
    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const newStart = convertToMinutes(startTime);
    const newEnd = convertToMinutes(endTime);
    const existingStart = convertToMinutes(this.startTime);
    const existingEnd = convertToMinutes(this.endTime);

    // Check for any overlap
    return (
        (newStart < existingEnd && newStart >= existingStart) || // New start is within existing
        (newEnd > existingStart && newEnd <= existingEnd) || // New end is within existing
        (newStart <= existingStart && newEnd >= existingEnd) // New completely encloses existing
    );
};

export default mongoose.model('Reservation', ReservationSchema);