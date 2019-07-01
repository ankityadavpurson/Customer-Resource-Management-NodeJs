const mongoose = require('mongoose');
const itemsPurchaseSchema = require('./itemsPurchase');

module.exports = mongoose.Schema({
    billId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        dropDups: true
    },
    dateOfPurchase: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    discount: { type: Number },
    itemsPurchase: [itemsPurchaseSchema]
});
