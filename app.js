const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/staylio';
const Listing = require('./models/listings.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

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
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Upadte Route
app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});