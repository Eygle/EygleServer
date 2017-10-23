/**
 * Node entry point
 */

import * as express from 'express';
import * as http from 'http';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
import * as q from 'q';
import * as fs from 'fs';
import * as path from 'path';

import DB from './modules/DB';
import Utils from './config/Utils';
import CronManager from './cron/CronManager';
import ExpressConfig from './config/ExpressConfig';
import PassportConfig from './config/PassportConfig';
import Routes from './config/Routes';

const MongoStore = connectMongo(session);

class ExpressServer {
   /**
    * Express application instance
    */
   private _app;

   /**
    * HTTP server
    */
   private _http: any;

   constructor() {
      this._app = express();
   }

   /**
    * Start node Express server
    */
   public start(): void {
      Utils.logger.info("     =================================");
      Utils.logger.info("     ===== START EYGLE DL SERVER =====");
      Utils.logger.info("     =================================\n");

      // Initialize all databases connections
      DB.init().then(() => {
         Utils.logger.info('All databases are connected and ready\n');
         this._init();
         this._createFilesDirectory();
         Utils.logger.info(`Node v${process.versions.node}`);
         Utils.logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);
         this._http.listen(this._app.get('port'), this._app.get('ip'), () => {
            Utils.logger.info("Express server listening on port %d\n", this._app.get('port'));
         });
      });
   }

   /**
    * Initialize server
    * @private
    */
   private _init(): void {
      this._http = http.createServer(this._app);

      // connect-mongo instance
      const mongoStore = new MongoStore({
         mongooseConnection: DB.instance,
         db: Utils.dbName
      }, (err) => {
         if (err) {
            Utils.logger.error('Mongo connection error:', err);
         }
      });

      // Common express session used in express and socket.io
      const sessionX = session({
         secret: Utils.sessionSecret,
         cookie: {
            maxAge: 2592000000 // 30 days
         },
         resave: true,
         saveUninitialized: true,
         store: mongoStore
      });

      ExpressConfig.init(this._app, sessionX);
      PassportConfig.init(this._app);
      Routes.init(this._app);
      ExpressConfig.handleErrors(this._app); // Last errors handler
      CronManager.init();
   }

   /**
    * TODO extract this method in a FileManager module (+ Utils.filesHierarchy)
    * Create files hierarchy
    * @param {Array<any>} files
    * @param {string} parentPath
    * @private
    */
   private _createFilesDirectory(files: Array<any> = Utils.filesHierarchy, parentPath: string = null): void {
      for (let f of files) {
         const filePath = parentPath ? parentPath : (f.path ? f.path : Utils.filesRoot);
         const file = path.join(filePath, f.name);
         const deleted = path.join(file, 'deleted');

         if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
         }
         if (!fs.existsSync(file)) {
            fs.mkdirSync(file);
         }
         if (f.deleted && !fs.existsSync(deleted)) {
            fs.mkdirSync(deleted);
         }
         if (f.children) {
            this._createFilesDirectory(f.children, file);
         }
      }
   }
}

new ExpressServer().start();
