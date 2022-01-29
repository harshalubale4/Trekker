// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const trekRoutes = require("./routes/trekker")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users");
const flash = require('connect-flash');
const sessionConfig = {
    name: 'session',
    secret: "thisisagoofysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
const mongoSanitize = require('express-mongo-sanitize');

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

mongoose.connect('mongodb://localhost:27017/trekker')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((e) => {
        console.log("Mongo Connection ERROR")
        console.log(e)
    })


app.use("/treks", trekRoutes);
app.use("/treks/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.render("home")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something Went Wrong"
    res.status(statusCode).render("treks/error", { err });
})

app.listen(3000, () => {
    console.log("Server Started on Port 3000")
})
