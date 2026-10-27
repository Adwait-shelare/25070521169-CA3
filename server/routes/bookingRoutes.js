const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  validateCoupon,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/validate-coupon', validateCoupon);
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
