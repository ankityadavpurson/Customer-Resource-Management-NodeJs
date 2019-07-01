const express = require('express');
const router = express.Router();

const Inventory = require('../model/inventory');
const response = require('../services/response');
const { checkAuth } = require('../services/jwt');

router.get('/item', checkAuth, (_req, _res, _next) => {
    Inventory.getItem(_req.headers.dbid, _req.query.id)
        .then(result =>
            response(
                _res, 200,
                result ? "Successful Found." : "Not Found.",
                result ? result : 0
            )
        )
        .catch(err => response(_res, 404, "Not Found.", err));
});

router.post('/add', checkAuth, (_req, _res, _next) => {
    Inventory.getItem(_req.headers.dbid)
        .then(inventory => {

            const size = inventory.length;
            _req.body.inventoryId = size === 0
                ? 1 : (inventory[size - 1].inventoryId) * 1 + 1;

            _req.body.clientId = _req.headers.dbid;

            Inventory.add(_req.body)
                .then(result => response(_res, 201, "Item added.", result))
                .catch(err => response(_res, 203, "Item not added.", err));

        }).catch(err => response(_res, 203, "Item not added.", err));
});

router.post('/update', checkAuth, (_req, _res, _next) => {

    _req.body.clientId = _req.headers.dbid;

    Inventory.update(_req.body)
        .then(result => { response(_res, 200, "Item Updated.", result.nModified) })
        .catch(err => response(_res, 203, "Item Not Updated.", err));
});

router.post('/remove/:id', checkAuth, (_req, _res, _next) => {
    Inventory.remove(_req.headers.dbid, _req.params.id)
        .then(result => {
            deleted = result.deletedCount;
            response(
                _res, 201,
                deleted === 1
                    ? "Item deleted."
                    : "Item not deleted.",
                deleted
            )
        })
        .catch(err => response(_res, 204, "Item not deleted.", err));
});

module.exports = router;
