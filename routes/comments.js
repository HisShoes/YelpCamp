var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

router.post("/", middleware.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("danger", "Something went wrong!"); 
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment){
              if(err) {
                req.flash("danger", "Something went wrong!"); 
                res.redirect("back");
              }  else {
                  //add user to comment before pushing to campground
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  
                  //add the comment to the campground
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              }
            });    
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash("danger", "Something went wrong!"); 
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
     })
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated_comment) {
        if(err) {
            req.flash("danger", "Something went wrong!"); 
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
     if(err) {
        req.flash("danger", "Something went wrong!"); 
        res.redirect("back");
     }  else {
        res.redirect("/campgrounds/" + req.params.id);
     }
   });
});


module.exports = router;




