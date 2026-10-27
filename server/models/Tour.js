const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    meals: { type: String, default: 'Breakfast Included' },
    accommodation: { type: String, default: 'Luxury 4/5-Star Hotel' },
  },
  { _id: false }
);

const bookedSeatSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide tour title'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please provide destination'],
      index: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Beach', 'Mountain', 'Heritage', 'Adventure', 'Honeymoon', 'Luxury', 'Spiritual'],
      default: 'Luxury',
    },
    duration: {
      type: String,
      required: [true, 'Please provide duration'],
      default: '5 Days / 4 Nights',
    },
    price: {
      type: Number,
      required: [true, 'Please provide price per person in INR (₹)'],
      min: [1, 'Price must be greater than 0'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify capacity per departure'],
      default: 15,
      min: 1,
    },
    bookedSeats: [bookedSeatSchema],
    availableDates: [
      {
        type: String,
      },
    ],
    overview: {
      type: String,
      default: '',
    },
    itinerary: [itineraryItemSchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    images: [{ type: String }],
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

tourSchema.index({ title: 'text', destination: 'text', overview: 'text' });

module.exports = mongoose.model('Tour', tourSchema);
