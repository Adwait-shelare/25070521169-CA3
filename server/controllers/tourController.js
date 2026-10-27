const Tour = require('../models/Tour');

// @desc    Get all tours with search, filter, and sort
// @route   GET /api/tours
// @access  Public
const getTours = async (req, res) => {
  try {
    const { keyword, category, duration, minPrice, maxPrice, sort } = req.query;

    const query = {};

    // Keyword search in title, destination, or overview
    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [{ title: regex }, { destination: regex }, { overview: regex }];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Duration filter
    if (duration && duration !== 'all') {
      if (duration === 'short') {
        query.duration = { $regex: /^[1-4]\s*Day/i };
      } else if (duration === 'medium') {
        query.duration = { $regex: /^[5-7]\s*Day/i };
      } else if (duration === 'long') {
        query.duration = { $regex: /^([8-9]|\d{2,})\s*Day/i };
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const tours = await Tour.find(query).sort(sortOption);

    res.json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (error) {
    console.error('[Get Tours Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured tours for home page
// @route   GET /api/tours/featured
// @access  Public
const getFeaturedTours = async (req, res) => {
  try {
    let tours = await Tour.find({ featured: true }).limit(6);
    if (!tours || tours.length === 0) {
      tours = await Tour.find().sort({ rating: -1 }).limit(6);
    }
    res.json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single tour by ID
// @route   GET /api/tours/:id
// @access  Public
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }
    res.json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unique categories and destinations list
// @route   GET /api/tours/meta
// @access  Public
const getTourMeta = async (req, res) => {
  try {
    const destinations = await Tour.distinct('destination');
    const categories = await Tour.distinct('category');
    res.json({
      success: true,
      destinations,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTours, getFeaturedTours, getTourById, getTourMeta };
