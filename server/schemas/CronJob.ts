import * as mongoose from 'mongoose';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';

const _schema: mongoose.Schema = DB.createSchema({
   name: String,
   logFilename: String,
   scheduleRule: String,
   isScheduled: Boolean,
   isRunning: {type: Boolean, 'default': false},
   lastRun: Date
}, false);

class CronJob extends ASchema {

   /**
    * Schema getter
    * @return {mongoose.Schema}
    */
   getSchema(): mongoose.Schema {
      return _schema;
   }
}

const instance = new CronJob();

module.exports.schema = instance;
export default instance;