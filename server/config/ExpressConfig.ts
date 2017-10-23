import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as compress from 'compression';
import * as busboy from 'connect-busboy';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';

import Utils from './Utils';
import Permission from '../modules/Permissions';
import {EdError} from './EdError';
import {EEnv} from "../typings/enums";

class ExpressConfig {

   /**
    * Initialize express
    * @param app Express instance
    * @param session Express session instance
    */
   public static init(app, session) {
      app.set("view options", {layout: false});
      app.set('port', Utils.port);
      app.disable('x-powered-by');

      app.use((<any>bodyParser).urlencoded({extended: true}));
      app.use(bodyParser.json({limit: '50mb'}));
      app.use(methodOverride());
      app.use(compress());
      app.use(cookieParser());
      app.use(session);

      // INIT PERMISSIONS
      app.use(Permission.middleware());

      // INIT CSRF
      if (EEnv.Test !== Utils.env) { //EEnv.Dev !== Utils.env &&
         this._initCSRF(app);
      }

      // MANAGE FILE UPLOADS
      app.use(busboy({
         limits: {
            fileSize: 10 * 1024 * 1024
         }
      }));
   }

   /**
    * Handle errors
    * @param app
    */
   public static handleErrors(app) {
      app.use(function (err, req, res, next) { // DO NOT REMOVE next argument
         if (err instanceof EdError || err.name === 'ValidationError') {
            Utils.logger.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Error ${err.status || 500}: ${err.message}`);
            res.status(err.status || 500).send(err.message);
         }
         else {
            Utils.logger.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Server Error ${err.status || 500}:`, err);
            res.status(err.status || 500).send(new EdError(err.status || 500).message);
         }
      });
   }

   /**
    * Init CSRF token checker
    * @param app
    * @private
    */
   private static _initCSRF(app) {
      app.use(csrf({
         cookie: {
            secure: EEnv.Dev !== Utils.env && EEnv.Test !== Utils.env // Only for productions
         }
      }));

      app.use(function (req, res, next) {
         res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: EEnv.Dev !== Utils.env && EEnv.Test !== Utils.env});
         next();
      });

      // Error handler
      app.use(function (err, req, res, next) {
         if (err.code !== 'EBADCSRFTOKEN') return next(err);

			// handle CSRF token errors here
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
			Utils.logger.error(`Error with CSRF token: HTTP ${req.method.toUpperCase()} ${req.url} [${ip}]`);
			res.status(403).send('Form tampered with');
		});

   }
}

export default ExpressConfig;
