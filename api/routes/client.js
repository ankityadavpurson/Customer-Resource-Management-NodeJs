const express = require('express');
const router = express.Router();

const Client = require('../model/client');
const response = require('../services/response');
const { dcrypt } = require('../services/encrypto');
const mail = require('../services/sendMails');

router.post('/add', (_req, _res, _next) => {
    Client.add(_req.body)
        .then(result => {
            result.password = 0;
            response(_res, 201, "Client added Successfully.", result);
        })
        .catch(err => response(_res, 501, "Error", err));
});

router.post('/forgot', (_req, _res, _next) => {

    const { clientId } = _req.body;

    Client.getClient(clientId)
        .select('name email password')
        .then(result => {
            if (result.length === 0)
                response(_res, 250, 'Unable to send email, try again.', 0);
            else {
                const { name, email, password } = result[0];
                mail(name, email, dcrypt(password))
                    .then(response(_res, 250, 'Email is send to your registered email, with password.', 0))
                    .catch(console.error);
            }
        })
        .catch(err => response(_res, 501, "Error", err));
});

module.exports = router;
