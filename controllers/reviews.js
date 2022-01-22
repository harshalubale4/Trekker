const Review = require('../models/review')
const Trek = require('../models/trekker');

module.exports.deleteReview = async (req, res, enxt) => {
    const { id, reviewId } = req.params;
    await Trek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted a Review');
    res.redirect(`/treks/${id}`);
};

module.exports.createReview = async (req, res) => {
    const trek = await Trek.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trek.reviews.push(review);
    await review.save();
    await trek.save();
    req.flash('success', 'Created a New Review')
    res.redirect(`/treks/${trek._id}`);
};