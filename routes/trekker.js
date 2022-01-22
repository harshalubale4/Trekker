const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsyncError")

const Trek = require("../models/trekker")

const { isLoggedIn, isAuthor, validateTrekker } = require('../middleware/middleware');

router.get('/', catchAsync(async (req, res) => {
    const treks = await Trek.find({})
    res.render("treks/index.ejs", { treks })
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("treks/new.ejs")
})

router.post("/", isLoggedIn, validateTrekker, catchAsync(async (req, res, next) => {
    const trek = new Trek(req.body.trek);
    trek.author = req.user._id;
    await trek.save()
    req.flash('success', 'Successfully made a new Trek Spot');
    res.redirect(`/treks/${trek._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!trek) {
        req.flash('error', "Oopsies!! the Trek Spot Doesn't Exist")
        res.redirect('/treks');
    }
    res.render("treks/show.ejs", { trek })
}))

router.get("/:id/edit", isAuthor, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const trek = await Trek.findById(id);
    if (!trek) {
        req.flash('error', "Oopsies!! the Trek Spot Doesn't Exist")
        res.redirect('/treks');
    }
    res.render("treks/edit", { trek })
}))

router.put("/:id", isAuthor, isLoggedIn, validateTrekker, catchAsync(async (req, res) => {
    const { id } = req.params;
    trek = await Trek.findByIdAndUpdate(id, { ...req.body.trek })
    req.flash('success', 'Successfully Updated Trek Spot')
    res.redirect(`/treks/${trek._id}`)
}))

router.delete("/:id", isAuthor, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedSpot = await Trek.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a Trek Spot')
    res.redirect("/treks");
}))

module.exports = router;