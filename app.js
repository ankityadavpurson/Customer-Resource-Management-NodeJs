const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const client = require('./api/routes/client');
const login = require('./api/routes/login');
const inventory = require('./api/routes/inventory');
const billing = require('./api/routes/billing');

const logger = require('./api/services/logger');

//handling CORS...
app.use(cors());

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger);

// Handle Routes
app.use('/client', client);
app.use('/login', login);
app.use('/inventory', inventory);
app.use('/billing', billing);

app.use(function ignoreFavicon(_req, _res, _next) {
    _req.originalUrl === '/favicon.ico'
        ? _res.status(204).json({ nope: true })
        : _next();
});

//handling errors...
app.use((_req, _res, _next) => {
    const error = new Error('Not Found!');
    error.status = 404;
    _next(error);
});

app.use((error, _req, _res, _next) => {
    _res.status(error.status || 500)
        .json({
            responseCode: error.status || 500,
            message: 'Server Not Responding ...',
            error: error.message
        });
});

module.exports = app;
