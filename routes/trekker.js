const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsyncError");
const Trek = require("../models/trekker");
const treks = require('../controllers/treks');
const { isLoggedIn, isAuthor, validateTrekker } = require('../middleware/middleware');

router.get('/', catchAsync(treks.index));

router.get("/new", isLoggedIn, treks.renderNewForm);

router.post("/", isLoggedIn, validateTrekker, catchAsync(treks.createTrekSpot));

router.get('/:id', catchAsync(treks.showTrekSpot));

router.get("/:id/edit", isAuthor, isLoggedIn, catchAsync(treks.renderEditForm));

router.put("/:id", isAuthor, isLoggedIn, validateTrekker, catchAsync(treks.updateTrekSpot));

router.delete("/:id", isAuthor, isLoggedIn, catchAsync(treks.deleteTrekSpot));

module.exports = router;