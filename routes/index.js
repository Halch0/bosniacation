var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
});

// AUTHENTICATION ROUTES
//Show Register form
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});
//Handle Registration
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully registered! Welcome to Bosniacation, " + user.username);
            res.redirect("/locations");
        });
    });
});

//Show Login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});
//Handle Login
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/locations",
    failureRedirect: "/login"
}), function(req, res) {
});

//Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/locations");
});

module.exports = router;