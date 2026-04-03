const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/staylio';
const Listing = require('./models/listings.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const path = require('path');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressErrors.js');
const {listingSchema,reviewSchema} = require('./schemaValidation.js');
const Review = require('./models/review.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
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

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMessage);
    }
    next();
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMessage);
    }
    next();
}

// Index Route
app.get('/listings', wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
}));

// New Route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}))

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Upadte Route
app.put("/listings/:id", validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Review 
// Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// Error Handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
    //res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});