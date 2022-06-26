const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false,
        default: 0
    },
    height: {
        type: Number,
        required: false,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    is_email_verified: {
        type: Boolean,
        default: false,
        required: false
    },
    daily_calorie_goal: {
        type: Number,
        required: false,
        default: 2000
    },
    weight: {
        type: Number,
        required: false,
        default: 0.0
    },
    calories_left: {
        type: Number,
        required: false,
        default: 2000
    },
    is_new_user: {
        type: Boolean,
        default: true,
        required: false
    },
},
    {
        timestamps: true
    }
);


module.exports = mongoose.model("User", UserSchema, "users")