const Trek = require('../models/trekker')
const { trekkerSchema, reviewSchema } = require("../validationSchemas")
const ExpressError = require("../utilities/ExpressError");
const Review = require('../models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Signed In');
        return res.redirect('/signin')
    }
    next();

}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const trek = await Trek.findById(id);
    if (!trek.author.equals(req.user._id)) {
        req.flash('error', 'You do not have Permission to do that');
        return res.redirect(`/treks/${id}`);
    }
    next()
}

module.exports.validateTrekker = (req, res, next) => {
    const { error } = trekkerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have Permission to do that');
        return res.redirect(`/treks/${id}`);
    }
}