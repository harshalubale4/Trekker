const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsyncError")
const Trek = require("../models/trekker")
const Review = require("../models/review")
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/middleware');

router.delete("/:reviewId", isLoggedIn, catchAsync(async (req, res, enxt) => {
    const { id, reviewId } = req.params;
    await Trek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted a Review');
    res.redirect(`/treks/${id}`);
}))

router.post("/", isLoggedIn, isReviewAuthor, validateReview, catchAsync(async (req, res) => {
    const trek = await Trek.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trek.reviews.push(review);
    await review.save();
    await trek.save();
    req.flash('success', 'Created a New Review')
    res.redirect(`/treks/${trek._id}`);
}))

module.exports = router;