const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/staylio';
const initData = require('./data.js');
const Listing = require('../models/listings.js');

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB();