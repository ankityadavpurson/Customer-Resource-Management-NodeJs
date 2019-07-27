const express = require('express');
const router = express.Router();

const Client = require('../model/client');
const response = require('../services/response');
const { crypt, dcrypt } = require('../services/encrypto');
const { token } = require('../services/jwt');
const mail = require('../services/sendMails');
const validateClient = require('../services/joiSchema');

router.post('/login', loginClient);
router.post('/add', addClient);
router.post('/forgot', forgotPassword);
router.post('/logout', logoutClint);

module.exports = router;

async function loginClient(_req, _res, _next) {
    const { clientId, password } = _req.body;
    try {
        const client = await Client.getClient(clientId);
        if (client && crypt(password) === client.password) {
            const { _id, clientId, name, emailId, phoneNo, shopNo, address } = client;

            const accessToken = token({ clientId, name, emailId, phoneNo, shopNo, address });
            const updateToken = await Client.updateAccessToken({ clientId }, accessToken);

            if (updateToken.nModified === 1)
                response(_res, 200, 'Client Found', { clientId: _id, accessToken });
            else throw new Error('DB Server Error');
        }
        else {
            response(_res, 200, 'Invalid id or password.');
        }
    }
    catch (err) {
        console.log(err);
        response(_res, 500, 'Server Error', { error: err });
    }
}

async function addClient(_req, _res, _next) {
    const result = validateClient(_req.body);
    if (result) return response(_res, 400, result, 0);

    try {
        const result = await Client.add(_req.body);
        result.password = 0;
        response(_res, 201, 'Client added Successfully.', result);
    } catch (err) {
        response(_res, 501, 'Error', err);
    }
}

async function forgotPassword(_req, _res, _next) {
    const { clientId } = _req.body;
    try {
        const client = await Client.getClient(clientId).select('name email password');
        if (client) {
            const { name, email, password } = client;

            const HTML = forgotPasswordTemplate({ name, password: dcrypt(password) });
            const subject = 'CRM Account Password Reset';
            const text = 'Your Password for CRM Account.';
            await mail([email], subject, text, HTML);

            response(_res, 250, 'Email is send to your registered email, with password.', 0);
        } else {
            throw new Error('User Not Found');
        }
    }
    catch (err) {
        console.log(err);
        response(_res, 250, 'User Id Not find.', 0);
    }
}

async function logoutClint(_req, _res, _next) {
    const _id = _req.headers.dbid;
    try {
        const updateToken = await Client.updateAccessToken({ _id }, 0);
        if (updateToken.nModified === 1)
            response(_res, 200, 'Logout Success.', 0);
        else throw new Error('DB Server Error');
    } catch (err) {
        console.log(err);
        response(_res, 500, 'Server Error.', 0);
    }
}

// Mail template halper for forgot password
function forgotPasswordTemplate(body) {

    const { NODEMAILER_EMAILID } = process.env;

    return `<p>
      <br /> Dear ${body.name}, <br />
      Your Password for CRM Account.
      Please use the below password in order to login.
      <br /><br />
      <strong> Password : </strong>
      <strong> ${body.password} </strong>
      <br /><br />
      If you have any questions or issues, please feel free to email us directly at
      <a href="mailto:${NODEMAILER_EMAILID}" target="_top">${NODEMAILER_EMAILID}</a> . <br /><br />
      Regards<br />
      CRM Team.
    </p>`;
}
