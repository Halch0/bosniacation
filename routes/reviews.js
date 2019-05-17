var express = require("express");
var router = express.Router({mergeParams: true});
var Location = require("../models/location");
var Review = require("../models/review");
var middleware = require("../middleware");

//REVIEWS INDEX PAGE
router.get("/", function(req, res) {
    Location.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} //sort to show latest review first
    }).exec(function(err, location) {
        if (err || !location) {
            req.flash("error", "Location not found!");
            return res.redirect("back");
        }
        res.render("reviews/index", {location: location});
    });
});

//NEW REVIEW FORM
router.get("/new", middleware.isLoggedIn, middleware.checkReview, function(req, res) {
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            req.flash("error", "Location not found!");
            return res.redirect("back");
        }
        res.render("reviews/new", {location: location});
    })
});

//CREATE REVIEW
router.post("/", middleware.isLoggedIn, middleware.checkReview, function(req, res) {
    Location.findById(req.params.id).populate("reviews").exec(function(err, location) {
        if (err) {
            console.log(err);
            req.flash("error", "Location not found!");
            return res.redirect("back");
        }
        Review.create(req.body.review, function(err, review) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.location = location;
            review.save();
            location.reviews.push(review);
            location.rating = calculateAverage(location.reviews);
            location.save();
            req.flash("success", "Your review has been added!");
            res.redirect("/locations/" + location._id);
        });
    });
});

//EDIT REVIEW
router.get("/:review_id/edit", middleware.checkReviewOwner, function(req, res) {
    Review.findById(req.params.review_id, function(err, foundReview) {
        if (err) {
            console.log(err);
            req.flash("error", "Review not found!");
            return res.redirect("back");
        }
        res.render("reviews/edit", {location_id: req.params.id, review: foundReview});
    });
});

//UPDATE REVIEW
router.put("/:review_id", middleware.checkReviewOwner, function(req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function(err, updatedReview) {
        if (err) {
            console.log(err);
            req.flash("error", "You are not authorized to do that!");
            return res.redirect("back");
        }
        Location.findById(req.params.id).populate("reviews").exec(function(err, location) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            location.rating = calculateAverage(location.reviews);
            location.save();
            req.flash("success", "Successfully updated review!");
            res.redirect("/locations/" + location._id);
        });
    })
});

//DELETE REVIEW
router.delete("/:review_id", middleware.checkReviewOwner, function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if (err) {
            console.log(err);
            req.flash("error", "You are not authorized to do that!");
            return res.redirect("back");
        }
        Location.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function(err, location) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                return res.redirect("back");
            }
            location.rating = calculateAverage(location.reviews);
            location.save();
            req.flash("success", "Review successfully deleted!");
            res.redirect("/locations/" + req.params.id);
        });
    })
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function(element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;

