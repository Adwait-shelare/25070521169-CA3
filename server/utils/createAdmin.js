const readline = require('readline');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderly';
    await mongoose.connect(mongoUri);
    console.log('\n--- Wanderly CLI Admin Account Creator ---');

    const name = (await askQuestion('Enter Full Name: ')) || 'Administrator';
    const email = (await askQuestion('Enter Email Address: ')).toLowerCase().trim();
    const password = await askQuestion('Enter Secure Password (min 6 chars): ');

    if (!email || !password || password.length < 6) {
      console.log('Error: Invalid email or password too short.');
      process.exit(1);
    }

    let user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      user.name = name;
      user.password = password;
      await user.save();
      console.log(`\nSuccess! Existing user ${email} promoted to Administrator.`);
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(`\nSuccess! New Administrator created for ${email}.`);
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

run();
