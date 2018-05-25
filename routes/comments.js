var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

//new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    ////find camp with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err){
            console.log("ERROR");
            } else {
                //console.log(camp);
                //render show template with that camp
                res.render("comments/new", {camp: camp});
            }
    })
})
//create comment
router.post("/", middleware.isLoggedIn, function(req, res){
    //find camp with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err){
            console.log("ERROR");
            res.redirect("/campgrounds");
            } else {
                //create new comment
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        req.flash("error", "Comment not found");
                        console.log(err);
                    }else {
                        //add username+id to comment: req.user = {username,salt,hash,_id}
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //save comment author info
                        comment.save();
                        //associate new comment to camp
                        camp.comments.push(comment);
                        camp.save();
                        //console.log(comment);
                        //redirect to camp show page
                        req.flash("success", "Successfully added a comment");
                        res.redirect("/campgrounds/"+camp._id);
                    }
                })
            }
    })
})
//edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
             res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
        }
    })
})
//update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
        res.redirect("/campgrounds/" + req.params.id);
    })
})
//delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
         
     })
})


module.exports = router;