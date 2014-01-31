var q = require( "q" ),
  config = require( "./config.json" ),
  utils = require( "./utils" ),
  // Entity = require( "./entity" ),
  datajs;

var buildData = function () {
  var self = this;

  if ( /^get$/i.test( self.type ) ) {
    return "";
  } else {
    return self.parameters;
  }
};

var buildUrl = function () {
  var self = this,
    querystring;

  if ( /^get$/i.test( self.type ) ) {
    querystring = utils.querystring.stringify( self.parameters );
    return self.url + ( querystring ? "?" : "" ) + querystring;
  } else {
    return self.url;
  }

};

/**
 * Query object used to construct a proper query in a fluent way
 *
 * @class  Query
 * @constructor
 * @param {String} url End point url
 * @param {String} type HTTP method
 */
var Query = function ( url, type, options ) {
  var self = this;

  // datajs = require( "./index" );

  self.url = url;
  self.type = utils.is.string( type ) ? type : config.defaults.defaultHttpMethod;
  self.options = utils.is.object( options ) ? options : {};
  self.parameters = {};

};

Query.prototype.parameter = function ( key, value ) {
  var self = this;

  if ( utils.is.empty( value ) ) {
    return self.parameters[ key ];
  }

  self.parameters[ key ] = value;

  return self;
};

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
Query.prototype.execute = function () {
  var self = this,
    // promise,
    requestData,
    defer = q.defer();
  // entityService = utils.is.object( self.options[ "entityService" ] ) ? self.options[ "entityService" ] : {},
  // metadataRequired = entityService.hasOwnProperty( "metadata" ) && !entityService[ "metadata" ] ? true : false,
  // metadataDefer;

  requestData = {
    type: self.type,
    url: self.url,
    data: self.parameters
  };

  // if ( metadataRequired ) {

  //   metadataDefer = q.defer();

  //   entityService.once( "metadata:loaded", function ( error, metadata ) {

  //     if ( error ) {
  //       return metadataDefer.reject( error );
  //     }

  //     var schema = new Schema(),
  //       metadataErrors = schema.validateObject( config.metadata, metadata ),
  //       metadataHasErrors = false;

  //     Object.keys( metadataErrors ).forEach( function ( metadataErrorKey ) {

  //       if ( metadataHasErrors === false && metadataErrors[ metadataErrorKey ] !== void 0 ) {
  //         metadataHasErrors = true;
  //       }

  //     } );

  //     if ( metadataHasErrors === true ) {
  //       metadataDefer.reject( new Error( "The metadata returned by the server is invalid" ) );
  //     } else {
  //       utils.request( requestData ).then( metadataDefer.resolve ).fail( metadataDefer.reject );
  //     }

  //   } );

  //   promise = metadataDefer.promise;

  // } else {

  //    promise = utils.request( requestData );

  // }

  utils.request( requestData ).then( function ( response ) {

    // TODO: put back into the entity or datajs
    // var entities = utils.is.array( res ) ? res : [],
    //   entity = utils.is.object( res ) ? res : {},
    //   schema = new Schema(),
    //   raw = self.options[ "raw" ] === true,
    //   sanitizedEntities = [],
    //   middlewareData;

    // if ( self.options[ "single" ] === true ) {

    //   sanitizedEntities = raw || !entityService[ "hasMetaData" ] ? entity : new Entity( schema.sanitize( entityService.metadata.entity, entity ), entityService.metadata, self.options );

    // } else {

    //   entities.forEach( function ( entity ) {
    //     sanitizedEntities.push( raw || !entityService[ "hasMetaData" ] ? entity : new Entity( schema.sanitize( entityService.metadata.entity, entity ), entityService.metadata, self.options ) );
    //   } );

    // }

    // middlewareData = utils.getResponseObject( utils.is.not.an.array( sanitizedEntities ) ? [] : sanitizedEntities, utils.is.array( sanitizedEntities ) ? null : sanitizedEntities, res );

    self.middleware( response, function ( error, middlewareResponse ) {
      middlewareResponse = utils.is.not.empty( middlewareResponse ) ? middlewareResponse : error instanceof Error ? null : error;
      error = error instanceof Error ? error : null;

      if ( error ) {
        defer.reject( error );
      } else {
        defer.resolve( middlewareResponse );
      }
      // defer.resolve( middlewareResponse && middlewareResponse !== middlewareData ? middlewareResponse : res );
    } );

  } ).fail( defer.reject ); // TODO: test this

  return defer.promise;
};

utils.optionify( Query );
utils.useify( Query );

exports = module.exports = Query;
exports.utils = utils;