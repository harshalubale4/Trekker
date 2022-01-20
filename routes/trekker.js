const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsyncError")
const ExpressError = require("../utilities/ExpressError");
const Trek = require("../models/trekker")
const Review = require("../models/review")
const { trekkerSchema, reviewSchema } = require("../validationSchemas")

const validateTrekker = (req, res, next) => {
    const { error } = trekkerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const treks = await Trek.find({})
    res.render("treks/index.ejs", { treks })
}))

router.get("/new", (req, res) => {
    res.render("treks/new.ejs")
})

router.post("/", validateTrekker, catchAsync(async (req, res) => {
    const trek = new Trek(req.body.trek)
    await trek.save()
    res.redirect(`/treks/${trek._id}`)
}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findById(id).populate('reviews')
    res.render("treks/show.ejs", { trek })
}))

router.get("/:id/edit", catchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id)
    res.render("treks/edit", { trek })
}))


router.put("/:id", validateTrekker, catchAsync(async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findByIdAndUpdate(id, { ...req.body.trek })
    res.redirect(`/treks/${trek._id}`)
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const deletedSpot = await Trek.findByIdAndDelete(id);
    res.redirect("/treks")
}))

module.exports = router;