var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//index- 
router.get("/", function(req, res){
    //get campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("ERROR");
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
    })
})
//create-
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form
    var name = req.body.name;
    var img = req.body.img;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: name, price: price, image: img, description: desc, author: author};
    // add to campgrounds array->create a new campground and save to db
    //campgrounds.push(newCamp);
    Campground.create(newCamp, function(err, newCamp){
        if(err){
        console.log("ERROR");
        } else {
            // redirect to /campgounds
            req.flash("success", "Successfully added a campground");
            console.log(newCamp);
            res.redirect("/campgrounds");
        }
    });
    
})
//new-
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

//show-show more info about camp
router.get("/:id", function(req, res){
    //find camp with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){//now comments is shown as text instead of id in camp
        if(err){
            console.log("ERROR");
            } else {
                res.render("campgrounds/show", {camp: camp});
            }
    })
   
})
//edit--form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        
        res.render("campgrounds/edit", {camp: camp});
        
    })
})
//update--form to submit to
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){

            res.redirect("/campgrounds/" + req.params.id);

    })
    //redirect to show page
})
//destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
     Campground.findByIdAndRemove(req.params.id, function(err){
            res.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
         
     })
})


module.exports = router;