import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as sendEmailTransport from 'nodemailer-sendmail-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as q from 'q';
import {EmailTemplate} from 'email-templates';
import Utils from '../config/Utils';
import {EEnv} from "../typings/enums";

class Emails {
   private _siteURL: string;

   constructor() {
      this._siteURL = "https://www.mapui.fr";
   }

    /**
     * TODO
     */
   public sendWelcome(dest: IUser) {

   }

    /**
     * TODO
     */
   public sendPasswordRecovery(dest: IUser) {

   }

    /**
     * TODO
     */
   public sendLockedAccount(dest: IUser) {

   }

    /**
     * TODO
     */
   public sendUnlockedAccount(dest: IUser) {

   }

   /**
    * Do send email with template
    * @param locals
    * @private
    */
   private _sendTemplateMail(locals) {
      const defer = q.defer();
      const smtpTransport = this._smtpConnect();
      const template = new EmailTemplate(`${__dirname}/../templates/${locals.template}`);

      handlebars.registerHelper('if_even', function (conditional, options) {
         return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
      });

      handlebars.registerHelper('if_even2', function (conditional, options) {
         if (options.data.root.comments_near.length) {
            conditional = conditional + options.data.root.comments_near.length;
         }
         return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
      });

      if (Utils.env !== EEnv.Prod) {
         locals.email = "dev@mapui.fr";
         locals.bccmail = '';
      }

      template.render(locals, function (err, results) {
         if (err) {
            Utils.logger.error("Email template rendering error: ", err);
            defer.reject(err);
         }
         else {
            if (Utils.env === EEnv.Dev || Utils.env === EEnv.Test) {
               smtpTransport.use('stream', require('nodemailer-dkim').signer({
                  domainName: 'mapui.fr',
                  keySelector: 'key1',
                  privateKey: fs.readFileSync(`${Utils.root}/server/misc/key1.mapui.fr.pem`)
               }));
            }

            const optSendMail: any = {
               from: "MaPUI.fr ✔ <no-reply@mapui.fr>",
               to: locals.email,
               bcc: locals.bccmail,
               subject: locals.subject,
               html: results.html,
               text: results.text
            };

            if (locals.attachments) {
               optSendMail.attachments = locals.attachments;
            }

            smtpTransport.sendMail(optSendMail, function (err, responseStatus) {
               if (err) {
                  Utils.logger.error(`Error while sending email to ${optSendMail.to}:`, err);
                  defer.reject(err);
               }
               else {
                  defer.resolve();
               }
            });
         }
      });

      return defer.promise;
   }

   /**
    * Create SMTP connexion
    * @return {Transporter}
    * @private
    */
   private _smtpConnect() {
      if (EEnv.Dev === Utils.env || EEnv.Test === Utils.env) {
         return nodemailer.createTransport(smtpTransport({
            host: 'smtp.free.fr',
            port: 465,
            secure: true,
            auth: {
               user: "mapuitest@free.fr",
               pass: "ruba1212"
            }
         }));
      }
      else {
         return nodemailer.createTransport(sendEmailTransport({path: '/usr/sbin/sendmail'}));
      }
   }
}

export default new Emails();
