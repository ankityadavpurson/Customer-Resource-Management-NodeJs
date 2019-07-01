require('dotenv').config();
const http = require('http');
const app = require('./app');
const hostname = require('./api/services/host');

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, hostname(port));
