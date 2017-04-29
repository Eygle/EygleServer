/**
 * Created by eygle on 4/29/17.
 */

const mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , MongoStore = require('connect-mongo/es5')(session)
    , conf = require('./env');

exports.default = (app) => {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cookieParser()); // read cookies (needed for auth)

    // Store session in mongo
    const store = new MongoStore({
        mongooseConnection: mongoose.connections[0],
        db: conf.db
    }, err => {
        console.log(err || 'connect-mongodb setup ok');
    });

    app.use(session({
        secret: conf.secrets.session,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        resave: true,
        saveUninitialized: true,
        store: store
    })); // session secret
};