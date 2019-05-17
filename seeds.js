var mongoose = require("mongoose");
var Location = require("./models/location");
var Comment = require("./models/comment");

var data = [
    {
        name: "Sacred Heart Cathedral",
        image: "https://sarajevo.travel/assets/photos/places/big/the-cathedral-of-jesus-sacred-heart-1397149753.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit ullamcorper sapien, iaculis pulvinar risus consectetur vel. Donec vitae feugiat erat. Proin quam urna, fermentum sit amet euismod sit amet, eleifend eget est. Vivamus gravida dapibus iaculis. Aliquam et urna hendrerit, aliquet massa nec, eleifend magna. Suspendisse convallis eleifend ultricies. Fusce hendrerit quam auctor aliquam consectetur. Donec diam urna, molestie in pretium ac, mollis ac risus. Ut iaculis, sem et ultricies pretium, ligula enim pulvinar orci, quis vestibulum ipsum felis sit amet neque."
    },
    {
        name: "Sebilj fountain",
        image: "https://sarajevo.travel/assets/photos/places/big/sebilj-1429006040.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit ullamcorper sapien, iaculis pulvinar risus consectetur vel. Donec vitae feugiat erat. Proin quam urna, fermentum sit amet euismod sit amet, eleifend eget est. Vivamus gravida dapibus iaculis. Aliquam et urna hendrerit, aliquet massa nec, eleifend magna. Suspendisse convallis eleifend ultricies. Fusce hendrerit quam auctor aliquam consectetur. Donec diam urna, molestie in pretium ac, mollis ac risus. Ut iaculis, sem et ultricies pretium, ligula enim pulvinar orci, quis vestibulum ipsum felis sit amet neque."
    },
    {
        name: "Vijecnica (City Hall)",
        image: "https://sarajevo.travel/assets/photos/places/big/vijecnica-1458031365.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit ullamcorper sapien, iaculis pulvinar risus consectetur vel. Donec vitae feugiat erat. Proin quam urna, fermentum sit amet euismod sit amet, eleifend eget est. Vivamus gravida dapibus iaculis. Aliquam et urna hendrerit, aliquet massa nec, eleifend magna. Suspendisse convallis eleifend ultricies. Fusce hendrerit quam auctor aliquam consectetur. Donec diam urna, molestie in pretium ac, mollis ac risus. Ut iaculis, sem et ultricies pretium, ligula enim pulvinar orci, quis vestibulum ipsum felis sit amet neque."
    }
]

function seedDB() {
    //Remove all locations.
    Location.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed locations!");
        //Add locations
        data.forEach(function (seed) {
            Location.create(seed, function (err, location) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("added a location.");
                    //Create a comment
                    Comment.create(
                        {
                            text: "This place is great!",
                            author: "Halid"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                location.comments.push(comment);
                                location.save();
                                console.log("Created new comment.");
                            }
                        });
                }
            });
        });
    });

}

module.exports = seedDB;


