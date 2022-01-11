const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
})

const Trek = new mongoose.model("Trek", TrekkerSchema);

module.exports = Trek;