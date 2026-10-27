const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

dotenv.config();

const viewDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderly';
    await mongoose.connect(mongoUri);
    console.log('\n--- Wanderly Database Summary ---');
    const usersCount = await User.countDocuments();
    const toursCount = await Tour.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    console.log(`Users:    ${usersCount}`);
    console.log(`Tours:    ${toursCount}`);
    console.log(`Bookings: ${bookingsCount}`);

    const tours = await Tour.find().select('title destination price category duration');
    console.log('\nAvailable Tours:');
    tours.forEach((t, i) => {
      console.log(` ${i + 1}. [${t.category}] ${t.title} - ₹${t.price.toLocaleString('en-IN')} (${t.duration})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

viewDB();
