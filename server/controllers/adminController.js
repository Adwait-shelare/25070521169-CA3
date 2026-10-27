const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

// @desc    Get dashboard metrics (Total Users, Tours, Bookings, Revenue)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalTours, totalBookings, revenueAgg, recentBookings] = await Promise.all([
      User.countDocuments(),
      Tour.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'Confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Booking.find()
        .populate('userId', 'name email phone')
        .populate('tourId', 'title destination price')
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTours,
        totalBookings,
        totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('tourId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Confirmed / Pending / Cancelled)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const previousStatus = booking.status;
    const tour = await Tour.findById(booking.tourId);

    // If changing to Cancelled from Confirmed, restore capacity
    if (previousStatus === 'Confirmed' && status === 'Cancelled' && tour) {
      const bookedRecord = tour.bookedSeats.find((b) => b.date === booking.travelDate);
      if (bookedRecord) {
        bookedRecord.count = Math.max(0, bookedRecord.count - booking.travelers);
        await tour.save();
      }
    }

    // If re-confirming a cancelled booking, check and deduct capacity
    if (previousStatus === 'Cancelled' && status === 'Confirmed' && tour) {
      const bookedRecord = tour.bookedSeats.find((b) => b.date === booking.travelDate);
      if (bookedRecord) {
        bookedRecord.count += booking.travelers;
      } else {
        tour.bookedSeats.push({ date: booking.travelDate, count: booking.travelers });
      }
      await tour.save();
    }

    booking.status = status;
    await booking.save();

    const io = req.app.get('io');
    if (io && tour) {
      io.emit('tourCapacityUpdated', {
        tourId: tour._id,
        travelDate: booking.travelDate,
        bookedSeats: tour.bookedSeats,
        capacity: tour.capacity,
      });
    }

    const updated = await Booking.findById(booking._id)
      .populate('userId', 'name email phone')
      .populate('tourId');

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new tour
// @route   POST /api/admin/tours
// @access  Private/Admin
const createTour = async (req, res) => {
  try {
    const {
      title,
      destination,
      category,
      duration,
      price,
      capacity,
      availableDates,
      overview,
      itinerary,
      inclusions,
      exclusions,
      images,
      featured,
    } = req.body;

    const tour = await Tour.create({
      title,
      destination,
      category,
      duration,
      price: Number(price),
      capacity: Number(capacity) || 15,
      availableDates: availableDates || ['2026-11-15', '2026-11-25', '2026-12-05'],
      overview: overview || '',
      itinerary: itinerary || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      images: images || [],
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Tour package created successfully!',
      tour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update tour
// @route   PUT /api/admin/tours/:id
// @access  Private/Admin
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }

    Object.assign(tour, req.body);
    await tour.save();

    res.json({
      success: true,
      message: 'Tour package updated successfully!',
      tour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete tour
// @route   DELETE /api/admin/tours/:id
// @access  Private/Admin
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }

    // Safety check: verify if there are any active confirmed bookings
    const activeBookings = await Booking.countDocuments({
      tourId: tour._id,
      status: 'Confirmed',
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete tour: ${activeBookings} active confirmed booking(s) exist for this expedition.`,
      });
    }

    await Tour.findByIdAndDelete(tour._id);

    res.json({
      success: true,
      message: 'Tour package deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllBookings,
  updateBookingStatus,
  createTour,
  updateTour,
  deleteTour,
};
