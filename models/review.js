var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: "Please provide a rating (1-5 stars).",
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not a number!"
        }
    },
    text: {
        type: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    }
},
    {
        timestamps: true
    });

    module.exports = mongoose.model("Review", reviewSchema);

    