if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

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
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/trekker'
const secret = process.env.SECRET || 'thisisagoofysecret';

mongoose.connect(dbUrl)
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((e) => {
        console.log("Mongo Connection ERROR")
        console.log(e)
    })

// 'mongodb://localhost:27017/trekker'
const MongoDBStore = require('connect-mongo');
const store = new MongoDBStore({
    mongoUrl: dbUrl,
     secret,
    touchAfter: 24 * 3600
});

store.on("error", function(e){
    console.log("Session Store Error", e);
})
const sessionConfig = {
    store,
    name: 'session',
     secret,
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
