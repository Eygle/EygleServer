import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import Utils from '../config/Utils';
import {CustomEdError} from "../config/EdError";
import {EHTTPStatus} from "../typings/enums";

abstract class ASchema {
   /**
    * Current schema's mongoose model
    */
   protected _model: mongoose.Model<any>;

   /**
    * Keys to encrypt before saving document
    */
   protected _encryptKeys: Array<string>;

   /**
    * Schema getter
    * @return {"mongoose".Schema}
    */
   abstract getSchema(): mongoose.Schema;

   constructor(encryptKeys = null) {
      this._encryptKeys = encryptKeys;
   }

   /**
    * Method called from DB.ts in
    * @param name
    * @return {mongoose.Model<any>}
    */
   public importSchema(name: string) {
      this._model = mongoose.model(name, this.getSchema(), name);
      return this._model;
   }

   /**
    * Get model by id
    * @param id
    * @param queryParams
    * @return {Promise<T>}
    */
   public get(id: string, queryParams: any = null) {
      const defer = q.defer();

      if (!Utils.isMongoId(id)) {
         defer.reject(new Error(`Invalid mongo id ${id}`));
      }
      else {
         const query = this._model.findById(id);
         this.applyQueryParams(query, queryParams);
         query.exec((err, item) => {
            if (err) return defer.reject(err);
            if (!item) return defer.reject(new CustomEdError("No such item", EHTTPStatus.BadRequest));
            defer.resolve(item);
         });
      }
      return defer.promise;
   }

   /**
    * Get all model
    * @return {Promise<T>}
    */
   public getAll(queryParams: any = null) {
      const defer = <q.Deferred<Array<IModel>>>q.defer();

      const query = this._model.find();
      this.applyQueryParams(query, queryParams);
      query.exec((err, items) => {
         if (err) return defer.reject(err);
         defer.resolve(items);
      });

      return defer.promise;
   }

   /**
    * Create new model instance
    * @param data
    * @param exclude
    * @return {Promise<T>}
    */
   public create(data: any, exclude = null) {
      return new this._model(this.formatData(data, exclude));
   }

   /**
    * Create new model instance and save it
    * @param data
    * @param exclude
    * @param populateOptions
    * @return {Promise<T>}
    */
   public add(data: any, exclude = null, populateOptions = null) {
      return DB.createItem(new this.create(data, exclude), populateOptions, this._model);
   }

   /**
    * Save model instance
    * @param item
    * @param data
    * @param exclude
    * @param populateOptions
    */
   public save(item: any, data: any = null, exclude = null, populateOptions = null) {
      return DB.saveItem(item, this.formatData(data, exclude), populateOptions, this._model);
   }

   /**
    * Find model instance by id and save it
    * @param id
    * @param data
    * @param exclude
    * @param populateOptions
    * @return {Promise<T>}
    */
   public saveById(id: string, data: any = null, exclude = null, populateOptions = null) {
      const defer = q.defer();

      if (data && data.hasOwnProperty('_id')) {
         delete data._id;
      }
      this.get(id, {})
         .then(item => {
            this.save(item, data, exclude, populateOptions)
               .then(item => defer.resolve(item))
               .catch(err => defer.reject(err));
         })
         .catch(err => defer.reject(err));

      return defer.promise;
   }

   /**
    * Mark item as deleted (without really deleting it)
    * @param item
    * @return {Promise<T>}
    */
   public setDeleted(item) {
      const defer = q.defer();

      if (!item) {
         defer.reject(new Error("Item not found"));
      }
      else {
         DB.saveItem(item, {deleted: true})
            .then(item => defer.resolve(item))
            .catch(err => defer.reject(err));
      }

      return defer.promise;
   }

   /**
    * Mark item as deleted (without really deleting it)
    * @param id
    */
   public setDeletedById(id) {
      const defer = q.defer();

      this.get(id, {})
         .then(item => {
            this.setDeleted(item)
               .then((item) => defer.resolve(item))
               .catch(err => defer.reject(err));
         })
         .catch(err => defer.reject(err));

      return defer.promise;
   }

   /**
    * Delete item
    * @param item
    * @return {Promise<T>}
    */
   public remove(item) {
      const defer = q.defer();

      if (!item) {
         defer.reject(new Error("Item not found"));
      }
      else {
         item.remove((err) => {
            if (err) return defer.reject(err);
            defer.resolve();
         });
      }

      return defer.promise;
   }

   /**
    * Delete item by id
    * @param id
    */
   public removeById(id) {
      const defer = q.defer();

      this.get(id, {})
         .then(item => {
            this.remove(item)
               .then((item) => defer.resolve(item))
               .catch(err => defer.reject(err));
         })
         .catch(err => defer.reject(err));

      return defer.promise;
   }

   /**
    * This method will format the given body by excluding provided keys (if any) and formatting any reference Objects
    * @param body
    * @param exclude
    */
   public formatData(body: any, exclude = null) {
      if (!body) return null;
      if (exclude) {
         for (let e of exclude) {
            if (body.hasOwnProperty(e)) {
               delete body[e];
            }
         }
      }

      for (let idx in body) {
         if (body.hasOwnProperty(idx)) {
            const value = body[idx];
            if (value instanceof Array) { // Try to generate an array of {_id: mongoId} objects
               for (let i in value) {
                  if (value.hasOwnProperty(i) && value[i] && value[i].hasOwnProperty('_id')) {
                     value[i] = value[i]._id;
                  }
               }
            }
            else if (value instanceof Object && value.hasOwnProperty('_id')) { // Try to extract _id from object
               body[idx] = value._id;
            }
            if (idx === '__v') {
               delete body.__v;
            }
         }
      }

      return body;
   }

   /**
    * Apply custom mongoose select and/or populate
    * @param query
    * @param queryParams
    * @private
    */
   protected applyQueryParams(query, queryParams) {
      if (queryParams) {
         if (queryParams.select) {
            queryParams.select = queryParams.select instanceof Array ? queryParams.select : [queryParams.select];
            for (let select of queryParams.select) {
               query.select(select);
            }
         }
         if (queryParams.populate) {
            queryParams.populate = queryParams.populate instanceof Array ? queryParams.populate : [queryParams.populate];
            for (let populate of queryParams.populate) {
               query.populate(populate);
            }
         }
         if (queryParams.sort) {
            query.sort(queryParams.sort);
         }
         if (queryParams.limit) {
            query.sort(queryParams.limit);
         }
      }
   }
}

export default ASchema;
