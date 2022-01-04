const express = require("express");
const app = express();
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require('mongoose');
const Trek = require("./models/trekker")

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

app.get('/treks', async (req, res) => {
    const treks = await Trek.find({})
    res.render("treks/index.ejs", { treks })
})

app.get("/treks/new", (req, res) => {
    res.render("treks/new.ejs")
})

app.post("/treks", async (req, res) => {
    const trek = new Trek(req.body.trek)
    await trek.save()
    res.redirect(`/treks/${trek._id}`)
})

app.get('/treks/:id', async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findById(id)
    res.render("treks/show.ejs", { trek })
})

app.get("/treks/:id/edit", async (req, res) => {
    const trek = await Trek.findById(req.params.id)
    res.render("treks/edit", { trek })
})

app.put("/treks/:id", async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findByIdAndUpdate(id, { ...req.body.trek })
    res.redirect(`/treks/${trek._id}`)
})

app.delete("/treks/:id", async (req, res) => {
    const { id } = req.params
    const deletedSpot = await Trek.findByIdAndDelete(id);
    res.redirect("/treks")
})
