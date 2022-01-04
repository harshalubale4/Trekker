const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrekkerSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    }
})

const Trekker = new mongoose.model("Trekker", TrekkerSchema);

module.exports = Trekker;