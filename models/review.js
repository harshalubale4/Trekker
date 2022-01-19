const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    },
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;