const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// Helper to generate reference format WND-XXXX-XXXX
const generateBookingReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WND-${p1}-${p2}`;
};

// Valid promo coupon database
const VALID_COUPONS = {
  WANDERLY10: { type: 'percent', value: 10, description: '10% Off Base Booking' },
  FIRSTTRIP: { type: 'flat', value: 2500, description: '₹2,500 Welcome Discount' },
  FESTIVE2026: { type: 'percent', value: 15, description: '15% Festive Privilege' },
  COLLEGEPROJECT: { type: 'percent', value: 20, description: '20% Academic Evaluation Special' },
};

// @desc    Validate a coupon code
// @route   POST /api/bookings/validate-coupon
// @access  Public
const validateCoupon = async (req, res) => {
  const { code, basePrice } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Please provide coupon code.' });
  }

  const cleanCode = code.toUpperCase().trim();
  const coupon = VALID_COUPONS[cleanCode];

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid coupon code. Try WANDERLY10, FIRSTTRIP, or FESTIVE2026.',
    });
  }

  const base = Number(basePrice) || 0;
  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.round((base * coupon.value) / 100);
  } else {
    discount = Math.min(base, coupon.value);
  }

  res.json({
    success: true,
    code: cleanCode,
    discount,
    description: coupon.description,
    message: `Coupon ${cleanCode} applied! Saved ₹${discount.toLocaleString('en-IN')}`,
  });
};

// @desc    Create a new tour booking with payment method, add-ons, and capacity sync
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      tourId,
      travelDate,
      travelers,
      contactDetails,
      addOns = [],
      insuranceAdded = false,
      couponCode = '',
      paymentMethod = 'UPI',
      paymentDetails = {},
    } = req.body;

    if (!tourId || !travelDate || !travelers || !contactDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide tourId, departure travel date, travelers count, and contact details.',
      });
    }

    const numTravelers = parseInt(travelers, 10);
    if (isNaN(numTravelers) || numTravelers < 1) {
      return res.status(400).json({
        success: false,
        message: 'Travelers count must be at least 1.',
      });
    }

    // 1. Fetch tour
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour package not found.' });
    }

    // 2. Check seat capacity for the selected date
    const bookedRecord = tour.bookedSeats.find((b) => b.date === travelDate);
    const currentlyBooked = bookedRecord ? bookedRecord.count : 0;
    const remainingSeats = tour.capacity - currentlyBooked;

    if (numTravelers > remainingSeats) {
      return res.status(400).json({
        success: false,
        message:
          remainingSeats <= 0
            ? `This departure date (${travelDate}) is completely sold out.`
            : `Only ${remainingSeats} seat${remainingSeats > 1 ? 's' : ''} available for ${travelDate}. You requested ${numTravelers}.`,
      });
    }

    // 3. Server-side price calculation (never trusting client math!)
    const pricePerPerson = tour.price;
    const basePrice = pricePerPerson * numTravelers;

    // Add-ons total
    let addOnsTotal = 0;
    const sanitizedAddOns = [];
    if (Array.isArray(addOns)) {
      addOns.forEach((item) => {
        if (item && item.name && Number(item.price) > 0) {
          const itemPrice = Number(item.price);
          sanitizedAddOns.push({ name: item.name, price: itemPrice });
          addOnsTotal += itemPrice;
        }
      });
    }

    // Insurance (₹999 per traveler if selected)
    const insuranceAmount = insuranceAdded ? 999 * numTravelers : 0;

    // Coupon discount calculation
    let discountAmount = 0;
    let validatedCoupon = '';
    if (couponCode) {
      const clean = couponCode.toUpperCase().trim();
      const coupon = VALID_COUPONS[clean];
      if (coupon) {
        validatedCoupon = clean;
        if (coupon.type === 'percent') {
          discountAmount = Math.round((basePrice * coupon.value) / 100);
        } else {
          discountAmount = Math.min(basePrice, coupon.value);
        }
      }
    }

    const totalPrice = Math.max(0, basePrice + addOnsTotal + insuranceAmount - discountAmount);

    // 4. Generate transaction ID & booking reference
    const transactionId = `TXN-WND-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
    let bookingReference = generateBookingReference();
    let existingRef = await Booking.findOne({ bookingReference });
    while (existingRef) {
      bookingReference = generateBookingReference();
      existingRef = await Booking.findOne({ bookingReference });
    }

    // 5. Update tour bookedSeats
    if (bookedRecord) {
      bookedRecord.count += numTravelers;
    } else {
      tour.bookedSeats.push({ date: travelDate, count: numTravelers });
    }
    await tour.save();

    // 6. Real-time broadcast via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('tourCapacityUpdated', {
        tourId: tour._id,
        travelDate,
        bookedSeats: tour.bookedSeats,
        capacity: tour.capacity,
      });
    }

    // 7. Save booking
    const booking = await Booking.create({
      bookingReference,
      userId: req.user._id,
      tourId: tour._id,
      travelDate,
      travelers: numTravelers,
      pricePerPerson,
      basePrice,
      addOns: sanitizedAddOns,
      addOnsTotal,
      insuranceAdded: !!insuranceAdded,
      insuranceAmount,
      couponCode: validatedCoupon,
      discountAmount,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'Pay Later' ? 'Pending' : 'Paid',
      paymentDetails: {
        transactionId,
        upiId: paymentDetails.upiId || '',
        cardLast4: paymentDetails.cardLast4 || (paymentMethod.includes('Card') ? '4242' : ''),
        bankName: paymentDetails.bankName || '',
        emiMonths: paymentDetails.emiMonths || 0,
      },
      status: 'Confirmed',
      contactDetails: {
        name: contactDetails.name || req.user.name,
        email: contactDetails.email || req.user.email,
        phone: contactDetails.phone || req.user.phone || '',
        specialRequests: contactDetails.specialRequests || '',
      },
    });

    const populatedBooking = await Booking.findById(booking._id).populate('tourId');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed and payment processed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('[Create Booking Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's personal bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
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

// @desc    Cancel user booking and restore seat capacity
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Restore seat capacity on Tour
    const tour = await Tour.findById(booking.tourId);
    if (tour) {
      const bookedRecord = tour.bookedSeats.find((b) => b.date === booking.travelDate);
      if (bookedRecord) {
        bookedRecord.count = Math.max(0, bookedRecord.count - booking.travelers);
        await tour.save();

        const io = req.app.get('io');
        if (io) {
          io.emit('tourCapacityUpdated', {
            tourId: tour._id,
            travelDate: booking.travelDate,
            bookedSeats: tour.bookedSeats,
            capacity: tour.capacity,
          });
        }
      }
    }

    booking.status = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    const populated = await Booking.findById(booking._id).populate('tourId');

    res.json({
      success: true,
      message: 'Booking cancelled and seats restored to tour departure availability.',
      booking: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, validateCoupon };
