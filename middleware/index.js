var Location = require("../models/location");
var Comment = require("../models/comment");
var Review = require("../models/review");
var middlewareObj = {};


middlewareObj.checkLocationOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Location.findById(req.params.id, function (err, foundLocation) {
            if (err || !foundLocation) {
                req.flash("error", "Location not found!");
                res.redirect("back");
            } else {
                // did logged in user submit location?
                if (foundLocation.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not authorized to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                // did logged in user submit comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not authorized to do that!"); 
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.checkReviewOwner = function (req, res, next) {
    if(req.isAuthenticated()) {
        Review.findById(req.params.review_id, function(err, foundReview) {
            if(err || !foundReview) {
                res.redirect("back");
            } else {
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not authorized to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.checkReview = function(req, res, next) {
    if (req.isAuthenticated()) {
        Location.findById(req.params.id).populate("reviews").exec(function(err, foundLocation) {
            if(err || !foundLocation) {
                req.flash("error", "Location not found!");
                res.redirect("back");
            } else {
                var foundUserReview = foundLocation.reviews.some(function(review) {
                    return review.author.id.equals(req.user._id);
                });
                if(foundUserReview) {
                    req.flash("error", "You already wrote a review!");
                    return res.redirect("/locations/" + foundLocation._id);
                }
                next();
            }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in!");
    res.redirect("/login");
}

module.exports = middlewareObj;