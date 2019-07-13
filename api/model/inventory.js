const mongoose = require('mongoose');

const categories = [
    'Stationary',
    'Grocery',
    'Vegetable',
    'Cold Drinks',
    'T-Shirt',
    'Electronics'
];

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
        require: true,
        min: 0
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
        enum: categories,
        default: 'any'
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

const updateQuantity = record => {

    const { clientId, itemsPurchaseId, quantity } = record;

    const Inventory = mongoose.model(clientId + '.inventory', inventorySchema)

    return Inventory.updateOne(
        { inventoryId: itemsPurchaseId },
        {
            $inc: { quantity: -(quantity) }
        }
    );
};

module.exports = { getItem, add, remove, update, updateQuantity, categories };
