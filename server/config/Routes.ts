import * as express from 'express';

import Resty from '../middlewares/Resty';
import Utils from './Utils';
import Auth from '../middlewares/Auth';
import EmailsUnsubscribe from '../middlewares/EmailsUnsubscribe';
import {EEnv} from "../typings/enums";

class Routes {
    public static init(app) {
        // Home exception (catch url '/', add cookie and serve index.html)
        app.get('/', [this.indexRedirect()]);

        // STATIC ROUTES
        app.use('/', express.static(Utils.clientRoot));

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
        app.get('/*', [this.indexRedirect()]);
    }

    private static indexRedirect() {
        return (req, res) => {
            Auth.addUserCookie(res, req.user || null);
            res.sendFile(`${Utils.clientRoot}/index.html`);
        };
    }
}

export default Routes;
