const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    inventoryId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    discount: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        enum: [
            'Stationary',
            'Grocery',
            'Vegitable',
            'Cold Drinks',
            'T-Shirt'
        ],
        default: 'Stationary'
    },
    expiryDate: {
        type: String
    },
});

const getItem = (clientId, id) => {

    const Inventory = mongoose.model(clientId + '.inventory', inventorySchema)

    return id
        ? Inventory.findOne({ inventoryId: id })
        : Inventory.find();
};

const add = record => {

    const { clientId, inventoryId, name, quantity, price, discount, type, expiryDate } = record;

    const Inventory = mongoose.model(clientId + '.inventory', inventorySchema)

    return new Inventory({
        _id: new mongoose.Types.ObjectId(),
        inventoryId, name, quantity, price, discount, type, expiryDate
    }).save();
}

const remove = (clientId, id) => {

    const Inventory = mongoose.model(clientId + '.inventory', inventorySchema)

    return Inventory.deleteOne({ inventoryId: id });
};

const update = record => {

    const { clientId, _id, name, quantity, price, discount, type, expiryDate } = record;

    const Inventory = mongoose.model(clientId + '.inventory', inventorySchema)

    return Inventory.updateOne(
        { _id },
        {
            $set: { name, quantity, price, discount, type, expiryDate }
        }
    );
};

module.exports = { getItem, add, remove, update };
