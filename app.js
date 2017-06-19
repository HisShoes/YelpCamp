//requires//
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");

//my requires//
//Database
var Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    SeedDB      = require("./seeds.js");
    
//routes
var commentRoutes       = require("./routes/comments"),
    campgroundsRoutes   = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//SeedDB();

//app set up//
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport setup//
app.use(require("express-session")({
    secret: "There's no way this secret will be broken",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass the user to all pages
app.use(function(req,res,next) {
    res.locals.user = req.user;
    res.locals.messages = {};
    res.locals.messages["danger"] = req.flash("danger");
    res.locals.messages["success"] = req.flash("success");
    next();
});

//routing
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/", indexRoutes);

//server start//
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp Server Started');
});
