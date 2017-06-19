//middlewares for the application
var middlewareObj = {};

//requireds
var Comment     = require("../models/comment"),
    Campground  = require("../models/campground");

//Middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    
    req.flash("danger", "You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                    req.flash("danger", "Campground not found!"); 
                    res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("danger", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("danger", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                    req.flash("danger", "Campground not found!"); 
                    res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("danger", "You don't have permission to do that!"); 
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("danger", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;