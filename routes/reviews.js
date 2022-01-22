const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsyncError")
const Trek = require("../models/trekker")
const Review = require("../models/review")
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/middleware');
const review = require('../controllers/reviews');

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

router.post("/", isLoggedIn, validateReview, catchAsync(review.createReview));

module.exports = router;