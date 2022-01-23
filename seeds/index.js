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
            price: 500,
            images: [
                {
                    url: 'https://res.cloudinary.com/dqg4yv2bd/image/upload/v1642919691/Trekker/oswr4jxaqzbbzbft9fkt.jpg',
                    filename: 'Trekker/oswr4jxaqzbbzbft9fkt',
                },
                {
                    url: 'https://res.cloudinary.com/dqg4yv2bd/image/upload/v1642919692/Trekker/rq6qldlpboswpxaduwbo.jpg',
                    filename: 'Trekker/rq6qldlpboswpxaduwbo',
                },
                {
                    url: 'https://res.cloudinary.com/dqg4yv2bd/image/upload/v1642919694/Trekker/ar6nex5xywbiaqvxok2p.jpg',
                    filename: 'Trekker/ar6nex5xywbiaqvxok2p',
                },
                {
                    url: 'https://res.cloudinary.com/dqg4yv2bd/image/upload/v1642919696/Trekker/vdrtezfrw2vr0uhozcyv.jpg',
                    filename: 'Trekker/vdrtezfrw2vr0uhozcyv',
                }
            ]
        })
        await newTrek.save()
    }

}

seedingDB()