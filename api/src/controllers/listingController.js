import Listing from '/opt/render/project/src/api/src/models/Listing.js';
// import Listing from '../models/Listing.js';

// @desc    Get all listings
// @route   GET /api/marketplace
// @access  Public
export const getListings = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      condition,
      locationType,
      priceMin,
      priceMax,
      sortBy,
      search
    } = req.query;

    // Build the query object
    const query = {};

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      query.subcategory = subcategory;
    }

    // Condition filter
    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    // Location type filter
    if (locationType && locationType !== 'all') {
      query['location.type'] = locationType;
    }

    // Price range filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) {
        query.price.$gte = Number(priceMin);
      }
      if (priceMax) {
        query.price.$lte = Number(priceMax);
      }
    }

    // Status filter - default to active listings only
    query.status = 'active';

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 }; // Default: newest first
    
    if (sortBy) {
      switch (sortBy) {
        case 'price_low':
          sortOptions = { price: 1 };
          break;
        case 'price_high':
          sortOptions = { price: -1 };
          break;
        case 'popular':
          sortOptions = { views: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        // Default case is already set (newest first)
      }
    }

    const listings = await Listing.find(query).sort(sortOptions);

    // Add user-specific fields if user is logged in
    if (req.user) {
      const userId = req.user._id;
      
      const listingsWithUserData = listings.map(listing => {
        const listingObj = listing.toObject();
        listingObj.isLiked = listing.likedBy.includes(userId);
        listingObj.isSaved = listing.savedBy.includes(userId);
        return listingObj;
      });
      
      res.json(listingsWithUserData);
    } else {
      // For non-logged in users, set isLiked and isSaved to false
      const listingsWithoutUserData = listings.map(listing => {
        const listingObj = listing.toObject();
        listingObj.isLiked = false;
        listingObj.isSaved = false;
        return listingObj;
      });
      
      res.json(listingsWithoutUserData);
    }
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Get a single listing
// @route   GET /api/marketplace/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Increment views counter
    listing.views += 1;
    await listing.save();
    
    // Add user-specific fields if user is logged in
    if (req.user) {
      const userId = req.user._id;
      const listingObj = listing.toObject();
      listingObj.isLiked = listing.likedBy.includes(userId);
      listingObj.isSaved = listing.savedBy.includes(userId);
      res.json(listingObj);
    } else {
      const listingObj = listing.toObject();
      listingObj.isLiked = false;
      listingObj.isSaved = false;
      res.json(listingObj);
    }
  } catch (error) {
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Create a new listing
// @route   POST /api/marketplace
// @access  Private
export const createListing = async (req, res) => {
  try {
    // Set createdBy from authenticated user
    req.body.createdBy = {
      id: req.user._id,
      name: req.body.isAnonymous ? 'Anónimo' : `${req.user.firstName} ${req.user.lastName}`,
      faculty: req.user.faculty
    };
    
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(400).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Update a listing
// @route   PUT /api/marketplace/:id
// @access  Private
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    
    // Check if user is the owner of the listing
    if (listing.createdBy.id.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this listing' });
      return;
    }
    
    // Update createdBy name if isAnonymous changes
    if ('isAnonymous' in req.body && listing.isAnonymous !== req.body.isAnonymous) {
      req.body.createdBy = {
        id: req.user._id,
        name: req.body.isAnonymous ? 'Anónimo' : `${req.user.firstName} ${req.user.lastName}`,
        faculty: req.user.faculty
      };
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedListing);
  } catch (error) {
    res.status(400).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/marketplace/:id
// @access  Private
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    
    // Check if user is the owner of the listing
    if (listing.createdBy.id.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this listing' });
      return;
    }
    
    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Toggle like on a listing
// @route   POST /api/marketplace/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    
    const userId = req.user._id;
    const isLiked = listing.likedBy.includes(userId);
    
    if (isLiked) {
      // Remove like
      listing.likedBy = listing.likedBy.filter(id => id.toString() !== userId.toString());
      listing.likes -= 1;
    } else {
      // Add like
      listing.likedBy.push(userId);
      listing.likes += 1;
    }
    
    await listing.save();
    
    res.json({
      id: listing._id,
      likes: listing.likes,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Toggle save on a listing
// @route   POST /api/marketplace/:id/save
// @access  Private
export const toggleSave = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    
    const userId = req.user._id;
    const isSaved = listing.savedBy.includes(userId);
    
    if (isSaved) {
      // Remove save
      listing.savedBy = listing.savedBy.filter(id => id.toString() !== userId.toString());
    } else {
      // Add save
      listing.savedBy.push(userId);
    }
    
    await listing.save();
    
    res.json({
      id: listing._id,
      isSaved: !isSaved
    });
  } catch (error) {
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Get saved listings
// @route   GET /api/marketplace/saved
// @access  Private
export const getSavedListings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const listings = await Listing.find({
      savedBy: userId,
      status: 'active'
    }).sort({ createdAt: -1 });
    
    const listingsWithUserData = listings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.isLiked = listing.likedBy.includes(userId);
      listingObj.isSaved = true; // These are all saved listings
      return listingObj;
    });
    
    res.json(listingsWithUserData);
  } catch (error) {
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};

// @desc    Get user liked listings
// @route   GET /api/marketplace/user/:userId/likes
// @access  Private
export const getUserLikedListings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch listings liked by the user
    const likedListings = await Listing.find({
      likedBy: userId,
      status: 'active'
    }).select('_id'); // Only return the IDs of liked listings

    const likedListingIds = likedListings.map(listing => listing._id);

    res.json({ likedListingIds });
  } catch (error) {
    console.error('Error fetching user liked listings:', error);
    res.status(500).json({
      message: (error instanceof Error) ? error.message : 'An unknown error occurred'
    });
  }
};

// @desc    Get my listings
// @route   GET /api/marketplace/my-listings
// @access  Private
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const listings = await Listing.find({
      'createdBy.id': userId
    }).sort({ createdAt: -1 });
    
    const listingsWithUserData = listings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.isLiked = listing.likedBy.includes(userId);
      listingObj.isSaved = listing.savedBy.includes(userId);
      return listingObj;
    });
    
    res.json(listingsWithUserData);
  } catch (error) {
    res.status(500).json({ 
      message: (error instanceof Error) ? error.message : 'An unknown error occurred' 
    });
  }
};