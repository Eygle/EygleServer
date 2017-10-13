import * as Twig from "twig";
import * as fs from "fs";
import * as bcrypt from "bcrypt";

import Utils from "../config/Utils";
import User from "../schemas/User.schema";
import {EHTTPStatus} from "../typings/enums";
import {CustomEdError} from "../config/EdError";

class EmailsUnsubscribe {
	/**
	 * Express middleware getter
	 */
	public getMiddleware() {
		return (req, res, next) => {
			const [email, hash] = req.params[0].split('/');

			Utils.logger.log(`User ${email} visited unsubscribe view`);

			this._checkUser(email, hash, (user) => {
				res.send(Twig.twig(<any>{
					data: <any>fs.readFileSync(`${Utils.root}/server/templates/unsubscribe_from_emails/unsubscribe.twig`, { encoding: 'UTF-8' })
				}).render({
					          html_title: 'Gestion des listes de diffusions',
					          title: 'Liste de diffusion',
					          subtitle: `Pour le compte associé à l'email ${email}`,
					          subscriptions: user.subscriptions
				          }));
			}, next);
		};
	};

	/**
	 * Express middleware getter
	 */
	public getPostMiddleware() {
		return (req, res, next) => {
			const [email, hash] = req.params[0].split('/');

			this._checkUser(email, hash, (user) => {
				for (let k in req.body.subscriptions) {
					if (req.body.subscriptions.hasOwnProperty(k)) {
						user.subscriptions[k] = req.body.subscriptions[k] === 'true';
					}
				}

				Utils.logger.log(`User '${email}' change it's subscriptions preferences`);
				user.save((err) => {
					if (err) return next(err);
					res.sendStatus(200);
				});
			}, next);
		};
	};

	/**
	 * User getter
	 * @param email
	 * @param hash
	 * @param success
	 * @param error
	 * @private
	 */
	private _checkUser(email, hash, success, error) {
		hash = hash.replace(new RegExp('\\+', 'g'), '/');
		User.findOneByEmail(email)
		      .then((user: IUser) => {
			      if (!user) return error(new CustomEdError("Email not found", EHTTPStatus.BadRequest));

			      if (bcrypt.compareSync(user._id.toString() + Utils.userHash, hash)) {
				      success(user);
			      }
			      else {
				      error(new CustomEdError("Invalid user hash", EHTTPStatus.BadRequest));
			      }
		      })
		      .catch(err => error(err));
	}
}

export default new EmailsUnsubscribe();