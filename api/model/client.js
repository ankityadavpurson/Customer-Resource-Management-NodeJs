const mongoose = require('mongoose');
const { crypt } = require('../services/encrypto');

const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientId: {
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
    email: {
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
    shopNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    }
});

const Client = mongoose.model('Client', clientSchema);

const getClient = clientId => {
    return clientId ? Client.findOne({ clientId }) : Client.find();
};

const add = record => {
    const { clientId, name, email, mobileNo, shopNo, address, password } = record;
    return new Client({
        _id: new mongoose.Types.ObjectId(),
        clientId, name, email, mobileNo, shopNo, address,
        password: crypt(password),
        accessToken: 0
    }).save();
};

const updateAccessToken = (condition, token) => {
    return Client.updateOne(condition, { $set: { accessToken: token } })
}

module.exports = { getClient, add, updateAccessToken };