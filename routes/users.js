const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require("../utilities/CatchAsyncError");
const user = require('../controllers/users');

router.get('/signup', user.renderSignUpForm);

router.post("/signup", catchAsync(user.userSignUp));

router.get('/signin', user.renderSignInForm);

router.post('/signin', passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }), user.userSignIn);

router.get('/logout', user.userLogOut)

module.exports = router;