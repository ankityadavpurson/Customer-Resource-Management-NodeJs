const mongoose = require('mongoose');
const billSchema = require('./bill');

const customerSchema = mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        dropDups: true
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
        index: true,
        dropDups: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        dropDups: true
    },
    customerType: {
        type: String,
        enum: ['Guest', 'Primary'],
        default: 'Guest'
    },
    address: { type: String },
    pincode: { type: Number },
    bills: [billSchema]
});

const getCustomer = (clientId, mobileNo) => {

    const Customer = mongoose.model(clientId + '.customer', customerSchema);

    return mobileNo ? Customer.findOne({ mobileNo }) : Customer.find();
};

const add = (clientId, record) => {

    const Customer = mongoose.model(clientId + '.customer', customerSchema);

    return new Customer(record).save()
};

const update = (clientId, mobileNo, bill) => {

    const Customer = mongoose.model(clientId + '.customer', customerSchema);

    return Customer.updateOne(
        { mobileNo },
        { $push: { bills: bill } });
}

module.exports = { getCustomer, add, update };
