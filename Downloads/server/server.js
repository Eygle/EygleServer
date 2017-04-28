// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const resty = require('resty');
const path = require('path');

mongoose.connect('mongodb://localhost/EygleDownloads'); // connect to database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 4242;        // set our port
const env = process.env.NODE_ENV || 'production';
const serve = path.join(__dirname, '../serve');

console.log("Server basedir: ", serve);
app.use('/', express.static(serve));
app.use('/bower_components', express.static(path.join(__dirname, '../../bower_components')));

// Define Api entry point
app.use('/api', resty.middleware(__dirname + '/app/api'));

// Fallback to serve dir (when loading an angular route directly
app.use('*', express.static(serve));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server is listening on port ' + port);