const express = require('express');
const router = express.Router();

const Inventory = require('../model/inventory');
const response = require('../services/response');
const { checkAuth } = require('../services/jwt');

router.get('/categories', getCategories); // Getting Categories
router.use(checkAuth); // Checking Auth
router.get('/item', getItem); // Getting Item(s)
router.post('/add', addItem); // Adding Item
router.post('/update', updateItem); // Updating Item
router.post('/remove/:id', removeItem); // Removing Item

module.exports = router;

async function getItem(_req, _res, _next) {
    try {
        const result = await Inventory.getItem(_req.headers.dbid, _req.query.id);
        response(_res, 200, result ? "Successful Found." : "Not Found.", result ? result : 0);
    } catch (err) {
        response(_res, 404, "Not Found.", err);
    }
}

async function addItem(_req, _res, _next) {
    try {
        const inventory = await Inventory.getItem(_req.headers.dbid);

        const size = inventory.length;
        _req.body.inventoryId = size === 0 ? 1 : (inventory[size - 1].inventoryId) * 1 + 1;

        _req.body.clientId = _req.headers.dbid;

        const result = await Inventory.add(_req.body);
        response(_res, 201, "Item added.", result);
    } catch (err) {
        response(_res, 203, "Item not added.", err);
    }
}

async function updateItem(_req, _res, _next) {
    try {
        _req.body.clientId = _req.headers.dbid;
        const result = await Inventory.update(_req.body);
        response(_res, 200, "Item Updated.", result.nModified);
    } catch (err) {
        response(_res, 203, "Item Not Updated.", err);
    }
}

async function removeItem(_req, _res, _next) {
    try {
        const result = await Inventory.remove(_req.headers.dbid, _req.params.id);
        deleted = result.deletedCount;
        response(_res, 201, deleted === 1 ? "Item deleted." : "Item not deleted.", deleted);
    } catch (err) {
        response(_res, 204, "Item not deleted.", err);
    }
}

async function getCategories(_req, _res, _next) {
    try {
        const categories = Inventory.categories;
        response(_res, 200, 'Categories found.', categories);
    } catch (err) {
        response(_res, 404, "Categories not found.", err);
    }
}
