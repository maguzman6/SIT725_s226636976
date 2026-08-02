const mongoose = require('mongoose');

const CoffeeSchema = new mongoose.Schema({
    coffee_name: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String,
    }
});

module.exports = mongoose.model('Coffee', CoffeeSchema);
