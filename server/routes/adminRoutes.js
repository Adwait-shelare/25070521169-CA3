const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllBookings,
  updateBookingStatus,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.post('/tours', createTour);
router.put('/tours/:id', updateTour);
router.delete('/tours/:id', deleteTour);

module.exports = router;
