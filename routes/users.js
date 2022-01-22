const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require("../utilities/CatchAsyncError")

router.get('/signup', (req, res) => {
    res.render("users/signup")
});

router.post("/signup", catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Trekker');
            res.redirect('/treks');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup')
    }

}));

router.get('/signin', (req, res) => {
    res.render('users/signin');
})

router.post('/signin', passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }), (req, res) => {
    req.flash('success', 'Welcome To Trekker');
    const redirectUrl = req.session.returnTo || 'treks';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out');
    res.redirect('/treks');
})

module.exports = router;