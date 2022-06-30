const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let EatSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    food_name: {
        type: String,
        required: true
    },
    food_id: {
        type: String,
        required: true
    },
    calories_consumed: {
        type: Number,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Eat", EatSchema, "foods_eaten");