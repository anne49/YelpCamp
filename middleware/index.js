// all middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to login to do that!");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            // does user own comment?
            if ( foundComment.author.id.equals(req.user._id) ){
                next();
            }else{  // otherwise, redirect
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }
    })
    }else{  // if not, redirect
        req.flash("error", "You need to login to do that!")
        console.log("Need to login to edit a page");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, camp){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            // does user own campground?
            if ( camp.author.id.equals(req.user._id) ){
                next();
            }else{  // otherwise, redirect
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }
    })
    }else{  // if not, redirect
        req.flash("error", "You need to login to do that!");
        console.log("Need to login to edit a page");
        res.redirect("back");
    }
};

module.exports = middlewareObj;