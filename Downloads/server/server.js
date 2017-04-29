const express = require('express')
    , app = express()
    , mongoose = require('mongoose')
    , conf = require('./config/env');

mongoose.connect('mongodb://localhost/' + conf.db); // connect to database

require('./config/express').default(app);
require('./config/passport').default(app);
require('./routes').default(app);

// START THE SERVER
app.listen(conf.port);
console.log('Server is listening on port ' + conf.port);