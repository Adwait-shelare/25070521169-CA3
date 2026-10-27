const Wishlist = require('../models/Wishlist');

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('tourIds');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, tourIds: [] });
    }

    res.json({
      success: true,
      tours: wishlist.tourIds,
      tourIds: wishlist.tourIds.map((t) => (t._id ? t._id.toString() : t.toString())),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle a tour in wishlist (add or remove)
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { tourId } = req.body;
    if (!tourId) {
      return res.status(400).json({ success: false, message: 'Please provide tourId.' });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, tourIds: [] });
    }

    const index = wishlist.tourIds.findIndex((id) => id.toString() === tourId.toString());
    let isWishlisted = false;

    if (index > -1) {
      // Remove
      wishlist.tourIds.splice(index, 1);
      isWishlisted = false;
    } else {
      // Add
      wishlist.tourIds.push(tourId);
      isWishlisted = true;
    }

    await wishlist.save();

    res.json({
      success: true,
      isWishlisted,
      message: isWishlisted ? 'Added to wishlist!' : 'Removed from wishlist!',
      tourIds: wishlist.tourIds.map((id) => id.toString()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWishlist, toggleWishlist };
