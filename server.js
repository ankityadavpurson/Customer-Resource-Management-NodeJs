const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const hostname = require('./api/services/host');

const MONGO_URL = 'mongodb+srv://crmmajorproject:' + process.env.MONGO_PASS + '@cluster0-nggmm.mongodb.net/CRM?retryWrites=true&w=majority';
mongoose.connect(MONGO_URL, { useCreateIndex: true, useNewUrlParser: true })
    .then(console.log("MongoDB connected :)"))
    .catch(error => console.log("Connection to Mongo :( ", error));

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, hostname(port));
