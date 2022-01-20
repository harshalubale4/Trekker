const express = require("express");
const app = express();
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");
const treks = require("./routes/trekker")
const reviews = require("./routes/reviews")
const session = require("express-session");
const sessionConfig = {
    secret: "thisisagoofysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionConfig));

mongoose.connect('mongodb://localhost:27017/trekker')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((e) => {
        console.log("Mongo Connection ERROR")
        console.log(e)
    })


app.use("/treks", treks);
app.use("/treks/:id/reviews", reviews);

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
