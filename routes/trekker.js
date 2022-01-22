const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsyncError");
const treks = require('../controllers/treks');
const { isLoggedIn, isAuthor, validateTrekker } = require('../middleware/middleware');

router.route('/')
    .get(catchAsync(treks.index))
    .post(isLoggedIn,
        validateTrekker,
        catchAsync(treks.createTrekSpot));

router.get("/new",
    isLoggedIn,
    treks.renderNewForm);

router.route('/:id')
    .get(catchAsync(treks.showTrekSpot))
    .put(isAuthor,
        isLoggedIn,
        validateTrekker,
        catchAsync(treks.updateTrekSpot))
    .delete(isAuthor,
        isLoggedIn,
        catchAsync(treks.deleteTrekSpot));

router.get("/:id/edit",
    isAuthor,
    isLoggedIn,
    catchAsync(treks.renderEditForm));

module.exports = router;