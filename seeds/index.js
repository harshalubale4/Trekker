const mongoose = require("mongoose")
const Trek = require("../models/trekker")
const trekData = require("./cities")

mongoose.connect('mongodb://localhost:27017/trekker')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((e) => {
        console.log("Mongo Connection ERROR")
        console.log(e)
    })

const seedingDB = async () => {
    await Trek.deleteMany({})
    for (let trek of trekData) {
        const newTrek = new Trek({ title: trek.title, location: trek.location })
        await newTrek.save()
    }

}

seedingDB()