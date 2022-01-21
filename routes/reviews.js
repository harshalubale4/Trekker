const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsyncError")
const ExpressError = require("../utilities/ExpressError");
const Trek = require("../models/trekker")
const Review = require("../models/review")
const { reviewSchema } = require("../validationSchemas")

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.delete("/:reviewId", catchAsync(async (req, res, enxt) => {
    const { id, reviewId } = req.params;
    await Trek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted a Review');
    res.redirect(`/treks/${id}`);
}))

router.post("/", validateReview, catchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id);
    const review = new Review(req.body.review);
    trek.reviews.push(review);
    await review.save();
    await trek.save();
    req.flash('success', 'Created a New Review')
    res.redirect(`/treks/${trek._id}`);
}))

module.exports = router;