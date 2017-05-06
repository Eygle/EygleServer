const express = require('express')
    , app = express()
  , db = require('./modules/db')
    , conf = require('./config/env');

db.init(() => {

  require('./config/express').default(app);
  require('./config/passport').default(app);
  require('./routes').default(app);

// START THE SERVER
  app.listen(conf.port);
  console.log('Server is listening on port ' + conf.port);
});