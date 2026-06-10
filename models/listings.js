const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image: {
        filename: {
          type: String,
          default: 'listingimage',
        },
        url: {
          type: String,
          required: true,
          default: 'https://unsplash.com/illustrations/a-house-with-trees-and-bushes-around-it-LtBrY2xXvXE',
          set: (v) =>
            v === ''
              ? 'https://unsplash.com/illustrations/a-house-with-trees-and-bushes-around-it-LtBrY2xXvXE'
              : v,
        },
      },
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    country  : {
        type : String,
        required : true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
    });

listingSchema.post("findOneAndDelete", async function(listing){
    if(listing.reviews.length){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

    const Listing = mongoose.model("Listing", listingSchema);
    module.exports = Listing;