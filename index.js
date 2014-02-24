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

utils.optionify( Query );
utils.useify( Query );

exports = module.exports = Query;
exports.utils = utils;
exports.config = config;