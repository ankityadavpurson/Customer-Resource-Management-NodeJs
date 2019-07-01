const mongoose = require('mongoose');

const billList = mongoose.Schema({
    billId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        dropDups: true
    },
    dateOfPurchase: {
        type: String,
        required: true,
        unique: true,
        index: true,
        dropDups: true
    },
    name: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const getBill = (clientId, billId) => {

    const BillList = mongoose.model(clientId + '.billList', billList);

    return billId ? BillList.findOne({ billId }) : BillList.find();
};

const add = (clientId, record) => {

    const BillList = mongoose.model(clientId + '.billList', billList);

    return new BillList(record).save();
};

module.exports = { getBill, add };
