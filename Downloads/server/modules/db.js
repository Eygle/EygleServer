/**
 * Created by eygle on 5/6/17.
 */

const mongoose = require('mongoose')
  , listDirectory = require('./listDirectory')
  , conf = require('../config/env');

let connected = false;
let db = null;
const models = {
  Episode: null,
  File: null,
  Movie: null,
  Proposal: null,
  TVShow: null,
  User: null
};

const loadAllModels = (files, path) => {
  for (let f of files) {
    if (f.directory) {
      loadAllModels(f.children, path + '/' + f.filename);
    } else {
      const model = f.extname ? f.filename.substr(0, f.filename.length - f.extname.length) : f.filename;
      models[model] = require(path + '/' + model);
      console.info(`Model ${model} loaded.`);
    }
  }
};

const loadModels = (callback) => {
  const path = `${__dirname}/../app/models`;
  loadAllModels(listDirectory(path), path);
  connected = true;
  if (callback)
    callback();
};

module.exports.init = (callback) => {
  if (!connected) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/' + conf.db);
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      loadModels(callback);
    });
  } else {
    if (callback)
      callback();
  }
};

module.exports.models = models;