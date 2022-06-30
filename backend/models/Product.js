const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    MatvareID: {
        type: String,
    },
    Matvare: {
        type: String
    },
    Kilokalorier: {
        type: String
    }
})

module.exports = mongoose.model("Product", ProductSchema, "products");