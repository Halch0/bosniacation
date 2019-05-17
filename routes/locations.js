var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var Review = require("../models/review");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX ROUTE - Show all locations
router.get("/", function (req, res) {
    Location.find({}, function (err, allLocations) {
        if (err) {
            console.log(err);
        } else {
            res.render("locations/index", { locations: allLocations, currentUser: req.user, page: 'locations' });
        }
    });
});

//CREATE ROUTE - Create new location and add to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //GET DATA FROM FORM
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newLocation = { name: name, image: image, description: description, author: author }
    //CREATE NEW LOCATION AND SAVE TO DB
    Location.create(newLocation, function (err, newlyCreated) {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            req.flash("success", "Location added succesfully!");
            res.redirect("/locations");
        }
    });
});

//"NEW" ROUTE - Show form to create new location
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("locations/new");
});

//SHOW ROUTE - Shows additional information on single location
router.get("/:id", function (req, res) {
    Location.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundLocation) {
        if (err || !foundLocation) {
            console.log(err);
            req.flash("error", "Location not found!");
            res.redirect("back");
        } else {
            res.render("locations/show", { location: foundLocation });
        }
    });
});

//EDIT LOCATION ROUTE
router.get("/:id/edit", middleware.checkLocationOwner, function (req, res) {
    Location.findById(req.params.id, function (err, foundLocation) {
        if (err) {
            res.redirect("/locations");
        } else {
            res.render("locations/edit", { location: foundLocation });
        }
    });
});
//UPDATE LOCATION ROUTE
router.put("/:id", middleware.checkLocationOwner, function (req, res) {
    delete req.body.location.rating;
    //find and update correct location
    Location.findByIdAndUpdate(req.params.id, req.body.location, function (err, updatedLocation) {
        if (err) {
            res.redirect("/locations");
        } else {
            req.flash("success", "Location successfully updated!");
            res.redirect("/locations/" + req.params.id);
        }
    });
    //redirect to show page
});
//DESTROY LOCATION ROUTE
router.delete("/:id", middleware.checkLocationOwner, function (req, res) {
    Location.findById(req.params.id, function (err, location) {
        if (err) {
            res.redirect("/locations");
        } else {
            Comment.remove({"_id": {$in: location.comments}}, function(err) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                    return res.redirect("/locations");
                }
                Review.remove({"_id": {$in: location.reviews}}, function(err) {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Something went wrong!");
                        return res.redirect("/locations");
                    }
                    location.remove();
                    req.flash("success", "Location successfully deleted!");
                    res.redirect("/locations");
                });
            });
        }
    });
});

module.exports = router;
