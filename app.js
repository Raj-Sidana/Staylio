const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/staylio';
const Listing = require('./models/listings.js');
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Index Route
app.get('/listings', async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
});

// New Route
app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs");
})

// Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

// app.get("/testlistings", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "Cozy Cottage",
//         description: "A cozy cottage in the countryside.",
//         price: 120,
//         location: "Countryside",
//         country: "Wonderland",
//     });

//     await sampleListing.save();
//     res.send("Sample listing created");
    
// });

