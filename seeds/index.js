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
        const newTrek = new Trek({
            title: trek.title,
            author: '61ebd66eefba93fc9cea68bf',
            location: trek.location,
            description: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati tempore doloremque quam, illum ullam officia quod aliquam at voluptatem mollitia ut sed exercitationem. Ratione eveniet maxime vero. Corporis, vero vitae.",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dHJla2tpbmd8ZW58MHx8MHx8&w=1000&q=80",
            price: 500
        })
        await newTrek.save()
    }

}

seedingDB()