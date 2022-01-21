const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require("../utilities/CatchAsyncError")

router.get('/signup', (req, res) => {
    res.render("users/signup")
});

router.post("/signup", catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    res.redirect('/treks');
}));

module.exports = router;