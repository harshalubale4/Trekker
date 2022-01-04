const express = require("express");
const app = express();
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require('mongoose');
const Trekker = require("./models/trekker")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))


mongoose.connect('mongodb://localhost:27017/trekker')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((e) => {
        console.log("Mongo Connection ERROR")
        console.log(e)
    })


app.listen(3000, () => {
    console.log("Server Started on Port 3000")
})

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/maketrek", async (req, res) => {
    const trek = new Trekker({ title: "My Backyard", price: "100", description: "Cheap Trek", location: "Home" })
    await trek.save()
    res.send(trek);
})