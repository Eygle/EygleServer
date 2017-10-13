import * as express from 'express';

import Resty from '../middlewares/Resty';
import Utils from './Utils';
import Auth from '../middlewares/Auth';
import EmailsUnsubscribe from '../middlewares/EmailsUnsubscribe';
import {EEnv} from "../typings/enums";

class Routes {
   public static init(app) {
      // STATIC ROUTES
      app.use('/', express.static(Utils.clientRoot));
      app.use('/app/index.css', express.static(`${Utils.clientRoot}/app/index.css'`));
      app.use('/feedback', express.static(`${Utils.root}/server/files/feedback`));

      if (EEnv.Prod !== Utils.env && EEnv.Preprod !== Utils.env) {
         app.use('/bower_components', express.static(`${Utils.root}/../bower_components`));
      }

      // API ENTRY POINT
      app.all('/api/*', [Resty.httpMiddleware(`${__dirname}/../api`)]);

      // AUTH
      app.post('/register', [Auth.registerMiddleware()]);
      app.post('/login', [Auth.loginLimitMiddleware(), Auth.loginMiddleware()]);
      app.post('/logout', [Auth.logoutMiddleware()]);
      app.post('/forgot-password', [Auth.forgotPasswordMiddleware()]);
      app.put('/change-password/*', [Auth.changePasswordMiddleware()]);
      app.put('/unlock-user/*', [Auth.unlockAccountMiddleware()]);

      // EMAILS UNSUBSCRIBE
      app.get('/unsubscribe/*', [EmailsUnsubscribe.getMiddleware()]);
      app.post('/unsubscribe/*', [EmailsUnsubscribe.getPostMiddleware()]);

      // FALLBACK (when reloading on a route redirect to index.html)
      app.get('/*', [(req, res) => {
         Auth.addUserCookie(res, req.user || null);
         res.sendFile(`${Utils.clientRoot}/index.html`);
      }]);
   }
}

export default Routes;
