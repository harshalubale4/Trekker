const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review")


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const TrekkerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [
        ImageSchema
    ],
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
});

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