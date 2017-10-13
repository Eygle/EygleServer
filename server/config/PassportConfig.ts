import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import * as local from 'passport-local';

import Utils from './Utils';
import User from "../schemas/User.schema";

class PassportConfig {
	public static init(app) {
		app.use(passport.initialize());
		app.use(passport.session());
		passport.use(this._localStrategy());
		(<any>passport).serializeUser(this._serializeUser());
		(<any>passport).deserializeUser(this._deserializeUser());
	}

	/**
	 * User local login strategy
	 * @private
	 */
	private static _localStrategy() {
		return new local.Strategy({ passReqToCallback: true }, (req, username, password, done) => {
			username = username.replace(" ", "");
			username = username.toLowerCase();

			User.findOneByUserNameOrEmail(username, true)
			      .then((user: IUser) => {
				      if (!user) {
					      Utils.logger.log(`User '${username}' login failed (no such username or email)`);
					      return done(null, false);
				      }

				      bcrypt.compare(password, user.password, (err, res) => {
					      if (!res) {
						      Utils.logger.log(`User '${username}' login failed (wrong password)`);
						      return done(null, false);
					      }

					      Utils.logger.log(`User '${username}' (${user._id}) logged in`);
					      return done(null, user);
				      });
			      })
			      .catch(err => done(err));
		});
	}

	/**
	 * Passport serialize user
	 * @private
	 */
	private static _serializeUser() {
		return (user, done) => {
			return done(null, user._id.toString());
		};
	}

	/**
	 * Passport deserialize user
	 * @private
	 */
	private static _deserializeUser() {
		return (id, done) => {
			User.getFullCached(id)
			      .then((user: IUser) => {
				      if (!user) return done(null, false);
				      done(null, user);
			      })
			      .catch(err => done(null, false));
		};
	}
}

export default PassportConfig;
