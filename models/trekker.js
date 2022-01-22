const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review")

const TrekkerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

TrekkerSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Trek = new mongoose.model("Trek", TrekkerSchema);

module.exports = Trek;