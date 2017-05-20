/**
 * Created by eygle on 5/20/17.
 */

const nodemailer = require('nodemailer')
  , q = require('q')
  , Twig = require('twig')
  , striptags = require('striptags')
  , conf = require('../config/env');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: conf.gmail.email,
    pass: conf.gmail.password
  }
});

const from = '"Eygle\'s server" <norepy.downloads@eygle.fr>';

const loadTemplate = (name) => {
  Twig.twig({
    id: name,
    path: `${__dirname}/templates/${name}.twig`,
    namespaces: {'my-project': `${__dirname}/templates/`},
    async: false
  });
};

loadTemplate('email-checker');

module.exports = {
  sendCheckEmail: (user) => {
    const defer = q.defer();
    const title = 'Vérification de ton email';

    const html = Twig.twig({ref: "email-checker"}).render({
      title: title,
      user: user,
      link: `${conf.host}/check-email?code=${user.emailCheckCode}`
    });

    transporter.sendMail({
      from: from,
      to: user.email,
      subject: title,
      text: striptags(html),
      html: html
    }, (err, info) => {
      if (err) return defer.reject(err);
      defer.resolve();
    });

    return defer.promise;
  }
};