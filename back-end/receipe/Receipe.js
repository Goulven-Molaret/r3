var mongoose = require('mongoose');

var ReceipeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    difficulty: String,
    country: String,
    type: String,
    description: String,
    ingredients: [{
        id: Number,
        name: String,
        quantity: String,
        unit: String
    }]
})

// Create the mongoose model
mongoose.model('Receipe', ReceipeSchema);

module.exports = mongoose.model('Receipe');