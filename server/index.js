//Main starting point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();

//DB setup
mongoose.connect('mongodb://localhost:auth/auth');

//app setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port:', port);