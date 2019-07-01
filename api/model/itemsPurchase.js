const mongoose = require('mongoose');

module.exports = itemsPurchaseSchema = mongoose.Schema({
    itemsPurchaseId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: { type: Number }
});
