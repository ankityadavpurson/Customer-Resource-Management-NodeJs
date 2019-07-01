const jwt = require('jsonwebtoken');
const response = require('../services/response');

const { JWT_SECRETKEY } = process.env;

const token = payload => { return jwt.sign(payload, JWT_SECRETKEY, { expiresIn: '12h' }) };

const checkAuth = (req, res, next) => {
    try {
        const tokenString = req.headers.token.split(' ')[1];
        const decode = jwt.verify(tokenString, JWT_SECRETKEY);
        req.clientData = decode;
        next();
    } catch (error) {
        response(res, 200, 'Auth Fail.', 0);
    }
};

module.exports = { token, checkAuth };
