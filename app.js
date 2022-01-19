const express = require("express");
const app = express();
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require('mongoose');
const catchAsync = require("./utilities/CatchAsyncError")
const Trek = require("./models/trekker")
const Review = require("./models/review")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");
const Joi = require('joi');
const { trekkerSchema, reviewSchema } = require("./validationSchemas")

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))

const validateTrekker = (req, res, next) => {
    const { error } = trekkerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

mongoose.connect('mongodb://localhost:27017/trekker')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((e) => {
        console.log("Mongo Connection ERROR")
        console.log(e)
    })




app.get("/", (req, res) => {
    res.render("home")
})

app.get('/treks', catchAsync(async (req, res) => {
    const treks = await Trek.find({})
    res.render("treks/index.ejs", { treks })
}))

app.get("/treks/new", (req, res) => {
    res.render("treks/new.ejs")
})

app.post("/treks", validateTrekker, catchAsync(async (req, res) => {
    const trek = new Trek(req.body.trek)
    await trek.save()
    res.redirect(`/treks/${trek._id}`)
}))

app.delete("/treks/:id/reviews/:reviewId", catchAsync(async (req, res, enxt) => {
    const { id, reviewId } = req.params;
    await Trek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/treks/${id}`);
}))

app.get('/treks/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findById(id).populate('reviews')
    res.render("treks/show.ejs", { trek })
}))

app.get("/treks/:id/edit", catchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id)
    res.render("treks/edit", { trek })
}))

app.post("/treks/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id);
    const review = new Review(req.body.review);
    trek.reviews.push(review);
    await review.save();
    await trek.save();
    res.redirect(`/treks/${trek._id}`);
}))

app.put("/treks/:id", validateTrekker, catchAsync(async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findByIdAndUpdate(id, { ...req.body.trek })
    res.redirect(`/treks/${trek._id}`)
}))

app.delete("/treks/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const deletedSpot = await Trek.findByIdAndDelete(id);
    res.redirect("/treks")
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something Went Wrong"
    res.status(statusCode).render("treks/error", { err });
})


app.listen(3000, () => {
    console.log("Server Started on Port 3000")
})
