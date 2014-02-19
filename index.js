var q = require( "q" ),
  config = require( "./config.json" ),
  extendify = require( "sc-extendify" ),
  utils = require( "./utils" );

/**
 * Query object used to construct a proper query in a fluent way
 *
 * @class  Query
 * @constructor
 * @param {String} url End point url
 * @param {String} type HTTP method
 */
var Query = extendify( {

  init: function ( url, type, options ) {
    var self = this;

    self.url = url;
    self.type = utils.is.string( type ) ? type : config.defaults.defaultHttpMethod;
    self.options = utils.is.object( options ) ? options : {};
    self.parameters = self.parameters = {};

  },

  parameter: function ( key, value ) {
    var self = this;

    if ( self.parameters.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.parameters[ key ];
    }

    self.parameters[ key ] = value;

    return self;
  },

  execute: function () {
    var self = this,
      preRequestDeferred = q.defer(),
      requestData,
      defer = q.defer();

    requestData = {
      type: self.type,
      url: self.url,
      data: self.parameters
    };

    self.middleware( "preRequest", function ( error, middlewareResponse ) {

      middlewareResponse = error && !( error instanceof Error ) ? error : middlewareResponse;
      error = error instanceof Error ? error : null;

      if ( error ) {
        defer.reject( error );
      } else {
        preRequestDeferred.resolve( middlewareResponse );
      }

    }, requestData );

    preRequestDeferred.promise.then( function ( preRequestResponse ) {

      utils.request( preRequestResponse ).then( function ( postRequestResponse ) {

        self.middleware( "postRequest", function ( error, middlewareResponse ) {

          middlewareResponse = error && !( error instanceof Error ) ? error : middlewareResponse;
          error = error instanceof Error ? error : null;

          if ( error ) {
            defer.reject( error );
          } else {
            defer.resolve( middlewareResponse );
          }

        }, postRequestResponse );

      } ).fail( defer.reject );

    } ).fail( defer.reject );

    return defer.promise;
  }

} );

Query.prototype.param = Query.prototype.parameter;

/**
 * specifying some predicate for filtering a request
 *
 * @method where
 * @param {String} the property you want to filter
 * @param {String} the predicate you want to assign to the filtering
 * @param {Object} the value of the predicate
 * @returns {Query} a Query Object
 */
// Query.prototype.where = function ( attribute, operation, value ) {

//   return this;
// };

/**
 * number of Entity you want to return
 *
 * @method take
 * @param {Number} the number of Entities you want to be retuned by the server
 * @returns {Query} a Query Object
 */
// Query.prototype.take = function ( number ) {

//   return this;
// };

/**
 * number of Entity you want to skip from the list
 *
 * @method skip
 * @param {Number} the number of Entities you want to skip
 * @returns {Query} a Query Object
 */
// Query.prototype.skip = function ( number ) {

//   return this;
// };

/**
 * Setup a query to use orderBy filter
 *
 * @method orderBy
 * @param {String} the attribute you want to use for the sorting
 * @param {String} the direction of the sorting ("asc" or "dsc")
 * @returns {Query} a Query Object
 */
// Query.prototype.orderBy = function ( attribute, direction ) {

//   return this;
// };

/**
 * Execute the query and return a deferred Object
 *
 * @method execute
 * @returns {
   Deferred
 }
 a Deferred Object
 */

utils.optionify( Query );
utils.useify( Query );

exports = module.exports = Query;
exports.utils = utils;
exports.config = config;