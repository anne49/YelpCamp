var express = require("express"),
    app = express(),
    request = require("request"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User =  require("./models/user"),
    seedDB = require("./seeds");
// require routes    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp12");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// passport configuration
app.use(require("express-session")({
    secret: "sally",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//.authenticate = a method coming from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})// is added in every route, available to every template

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes);
      

// RESTful routing




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp app has started!!");
});