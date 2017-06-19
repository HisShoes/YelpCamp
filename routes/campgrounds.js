var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//show campground list, INDEX
router.get("/", function(req,res) {
   getCampgrounds({}, function(allCampgrounds){
           res.render("campgrounds/index", {campgrounds:allCampgrounds});
   });
});

//form to create new campground, NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new"); 
});

//show more info about one campground, SHOW
router.get("/:id", function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("danger", "Something went wrong!"); 
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("danger", "Something went wrong!"); 
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //find and update a campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            req.flash("danger", "Something went wrong!"); 
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY//
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
       if(err){
            req.flash("danger", "Something went wrong!"); 
            res.redirect("back");
       } else {
            res.redirect("/campgrounds");
       }
   });
});

////posts////
//create new campground, CREATE
router.post("/", middleware.isLoggedIn, function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {username: req.user.username, id: req.user._id};
    
    //create object from input
    var  newCampground = {name:name, image:image, description:description, author: author};
    
    //push new campground to db then redirect to 
    createCampground(newCampground, function(){ 
       res.redirect("/campgrounds");
    });
});

//create a new campground
function createCampground(newCampground, callback) {
    //push new campground to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            //go back to campgrounds
            callback();
        }
    });
};

//return campgrounds that match the object passed in
function getCampgrounds(campgrounds, callback) {
Campground.find(campgrounds, function(err, foundCampgrounds){
       if(err){
           console.log(err);
       } else {
           callback(foundCampgrounds);
       }
   });
 };
 
module.exports = router;
