const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require("../utilities/CatchAsyncError");
const user = require('../controllers/users');

router.route('/signup')
    .get(user.renderSignUpForm)
    .post(catchAsync(user.userSignUp));

router.route('/signin')
    .get(user.renderSignInForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' }),
        user.userSignIn);

router.get('/logout',
    user.userLogOut)

module.exports = router;