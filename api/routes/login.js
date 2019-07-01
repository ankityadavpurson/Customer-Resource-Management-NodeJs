const express = require('express');
const router = express.Router();

const Client = require('../model/client');
const response = require('../services/response');
const { crypt } = require('../services/encrypto');
const { token } = require('../services/jwt');

router.post('/', (_req, _res, _next) => {

    const { clientId, password } = _req.body;

    Client.getClient(clientId)
        .then(data => {
            if (data.length !== 1)
                response(_res, 200, 'Invalid id or password.', 0);

            if (data[0]) {

                const { _id, clientId, name, emailId, phoneNo, shopNo, address } = data[0];

                if (crypt(password) !== data[0].password) {
                    response(_res, 200, 'Invalid id or password', 0);
                } else {
                    response(_res, 200, "Client Foud", {
                        clientId: _id,
                        accessToken: token({ clientId, name, emailId, phoneNo, shopNo, address })
                    });
                }
            }
        })
        .catch(err => response(_res, 500, "Server Error", { error: err }));
});

module.exports = router;
