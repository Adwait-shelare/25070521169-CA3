const express = require('express');
const router = express.Router();
const {
  getTours,
  getFeaturedTours,
  getTourById,
  getTourMeta,
} = require('../controllers/tourController');

router.get('/featured', getFeaturedTours);
router.get('/meta', getTourMeta);
router.get('/:id', getTourById);
router.get('/', getTours);

module.exports = router;
