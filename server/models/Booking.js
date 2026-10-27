const mongoose = require('mongoose');

const addOnItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    travelDate: {
      type: String,
      required: [true, 'Please select a departure travel date'],
    },
    travelers: {
      type: Number,
      required: [true, 'Please specify number of travelers'],
      min: [1, 'At least 1 traveler required'],
      default: 1,
    },
    pricePerPerson: {
      type: Number,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    addOns: [addOnItemSchema],
    addOnsTotal: {
      type: Number,
      default: 0,
    },
    insuranceAdded: {
      type: Boolean,
      default: false,
    },
    insuranceAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit/Debit Card', 'Net Banking', 'EMI', 'Pay Later'],
      default: 'UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded'],
      default: 'Paid',
    },
    paymentDetails: {
      transactionId: { type: String, default: '' },
      upiId: { type: String, default: '' },
      cardLast4: { type: String, default: '' },
      bankName: { type: String, default: '' },
      emiMonths: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled'],
      default: 'Confirmed',
    },
    contactDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
