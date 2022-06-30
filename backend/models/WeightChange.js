const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let WeightChangeSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    old_weight: {
        type: String,
        required: true
    },
    new_weight: {
        type: String,
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

module.exports = mongoose.model("WeightChange", WeightChangeSchema, "weight_changes");