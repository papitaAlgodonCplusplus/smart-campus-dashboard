import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['books', 'electronics', 'clothing', 'furniture', 'services', 'tickets', 'housing', 'other']
  },
  subcategory: { 
    type: String, 
    required: [true, 'Subcategory is required']
  },
  condition: { 
    type: String, 
    required: [true, 'Condition is required'],
    enum: ['new', 'like_new', 'good', 'fair', 'poor', 'not_applicable']
  },
  location: {
    type: {
      type: String,
      enum: ['campus', 'express'],
      required: [true, 'Location type is required']
    },
    campus: {
      type: String
    },
    position: {
      type: [Number],
      index: '2dsphere',
      validate: {
        validator: function(v) {
          // Position is required if type is campus
          return !(this.location.type === 'campus' && (!v || v.length !== 2));
        },
        message: 'Position coordinates are required for campus locations'
      }
    },
    locationName: {
      type: String,
      validate: {
        validator: function(v) {
          // Location name is required
          return (!!v && v.trim() !== '');
        },
        message: 'Location name is required'
      }
    }
  },
  photos: {
    type: [String],
    default: ['/images/default.jpg']
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String },
    whatsapp: { type: String }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    name: {
      type: String,
      required: [true, 'User name is required']
    },
    faculty: {
      type: String,
      required: [true, 'Faculty is required']
    }
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'reserved', 'expired'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  savedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
listingSchema.index({ category: 1 });
listingSchema.index({ subcategory: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ "createdBy.id": 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ createdAt: -1 });

// Check if a contact method is provided
listingSchema.pre('save', function(next) {
  const contactInfo = this.contactInfo;
  if (!contactInfo.phone && !contactInfo.email && !contactInfo.whatsapp) {
    const error = new Error('At least one contact method (phone, email, or whatsapp) is required');
    return next(error);
  }
  next();
});

export default mongoose.model('Listing', listingSchema);