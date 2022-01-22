const User = require('../models/user');

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup")
};

module.exports.userSignUp = async (req, res) => {
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

};

module.exports.renderSignInForm = (req, res) => {
    res.render('users/signin');
};

module.exports.userSignIn = (req, res) => {
    req.flash('success', 'Welcome To Trekker');
    const redirectUrl = req.session.returnTo || 'treks';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.userLogOut = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out');
    res.redirect('/treks');
};