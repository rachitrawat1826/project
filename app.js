if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}


const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./util/ExpressError.js")
const Review = require("./model/review.js")

const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./model/user.js")

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const user = require("./model/user.js")



app.use(session({
    secret: "hiii...",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust"

main().then(() => {
    console.log("connection to  DB")
}).catch((err) => {
    console.log(err)
})

async function main(params) {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "public")))



app.get("/", (req, res) => {
    res.send("hi I am root")
})

app.use(flash());

app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})



app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    const message = err.message || "Something went wrong!";
    res.render("error.ejs", { message })
        // res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log("sever is  listening on port 3000")
})