/**
 * @namespace
 */

var q = require( "q" ),
  config = require( "./config.json" ),
  extendify = require( "sc-extendify" ),
  utils = require( "./utils" );

var Query = extendify( {

  /**
   * `Query` is a versatile XHR module with various helpers and utilities to make configuring,
   * executing and extending ajax related tasks very easy. `Query` is a small standalone module with
   * everything baked in including callbacks and error handling by <a href="http://npmjs.org/q" target="_blank">q</a>
   * which implements follows the standard <a href="http://promises-aplus.github.io/promises-spec/" target="_blank">promise</a> pattern.
   *
   * ```javascript
   * var personQuery = new Query( "/person", "get" );
   *
   * personQuery.param( "name", "Kelsey Mayer" ).execute().then( function ( kelsey ) {
   *
   *   kelsey.name.should.equal( "Kelsey Mayer" );
   *   _done();
   *
   * } );
   * ```
   *
   * @class Query
   * @constructor
   * @param  {String} url     The URL end point
   * @param  {String} type    The HTTP method
   * @param  {Object} [options] The options
   * @return {Query}
   */
  init: function ( url, type, options ) {
    var self = this;

    /**
     * The URL end point
     * @property {String} url
     */
    self.url = url;

    /**
     * The HTTP method
     * @property {String} type
     */
    self.type = utils.is.string( type ) ? type : config.defaults.defaultHttpMethod;

    /**
     * The options
     * @property {String} options
     */
    self.options = utils.is.an.object( options ) ? options : {};

    self.__parameters = {};
    self.__queries = {};
    self.__headers = {};

    if( self.options.headers ) {
      self.__headers = utils.merge( self.__headers, self.options.headers );
    }
  },

  /**
   * Gets or sets all the parameters. A parameter is typically the JSON body data of the request.
   *
   * @method parameters
   * @chainable
   * @param  {Object} [data] Merges the given data into the current parameters
   * @return {Mixed} If `data` was given, `self` is returned, otherwise all the parameters are returned
   */
  parameters: function ( data ) {
    var self = this;
    if ( utils.is.an.object( data ) ) {
      self.__parameters = utils.merge( self.__parameters, data );
      return self;
    }
    return self.__parameters;
  },

  /**
   * Gets or sets a parameter by a key/value pair. A parameter is typically the JSON body data of the request.
   *
   * @method parameter
   * @chainable
   * @param  {String} key   The parameter key
   * @param  {String} value The parameter value
   * @return {Mixed} If `key` and `value` was given `self` is returned, if only `key` was given, the value of that key is returned.
   */
  parameter: function ( key, value ) {
    var self = this;

    if ( self.__parameters.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.__parameters[ key ];
    }

    self.__parameters[ key ] = value;

    return self;
  },

  /**
   * Gets or sets all the queries. Queries are the key/value pairs added to the querystring of the request.
   *
   * @method queries
   * @chainable
   * @param  {Object} [data] Merges the given data into the current queries
   * @return {Mixed} If `data` was given, `self` is returned, otherwise all the queries are returned
   */
  queries: function ( data ) {
    var self = this;
    if ( utils.is.an.object( data ) ) {
      self.__queries = utils.merge( self.__queries, data );
      return self;
    }
    return self.__queries;
  },

  /**
   * Gets or sets a query by a key/value pair. A query is the key/value pair which is added to the queryingstring.
   *
   * @method query
   * @chainable
   * @param  {String} key   The query key
   * @param  {String} value The query value
   * @return {Mixed} If `key` and `value` was given `self` is returned, if only `key` was given, the value of that key is returned.
   */
  query: function ( key, value ) {
    var self = this;

    if ( self.__queries.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.__queries[ key ];
    }

    self.__queries[ key ] = value;

    return self;
  },

  /**
   * Gets or sets a header by a key/value pair. A header is the key/value pair which is added to the headers of the request.
   *
   * @method header
   * @chainable
   * @param  {String} key   The header key
   * @param  {String} value The header value
   * @return {Mixed} If `key` and `value` was given `self` is returned, if only `key` was given, the value of that key is returned.
   */
  header: function ( key, value ) {
    var self = this;

    if ( self.__headers.hasOwnProperty( key ) && utils.is.empty( value ) ) {
      return self.__headers[ key ];
    }

    self.__headers[ key ] = value;

    return self;
  },

  /**
   * Executes the query by triggering the XHR request to the given url (end point).
   *
   * @method execute
   * @return {Promise} This <a href="http://promises-aplus.github.io/promises-spec/" target="_blank">promise</a> is generated by <a href="http://npmjs.org/q" target="_blank">q</a>.
   */
  execute: function () {
    var self = this,
      preRequestDeferred = q.defer(),
      requestData,
      defer = q.defer();

    requestData = {
      type: self.type,
      url: self.url,
      data: self.__parameters,
      query: self.__queries,
      header: self.__headers
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

/**
 * Middleware integration using <a href="http://npmjs.org/sc-useify" target="_blank">sc-useify</a>.
 *
 * @static
 * @property {Function} useify
 *
 */
utils.useify( Query );

/**
 * Adds middleware using <a href="http://npmjs.org/sc-useify" target="_blank">sc-useify</a>. As of sc-query@0.0.11 there are two named middleware keys.
 *
 * - `preRequest` occurs just before the XHR request is made. The data is given to the middleware and should be given back when the callback is triggered.
 * - `postRequest` occurs after the XHR request resolves. The data is given to the middleware and should be given back when the callback is triggered.
 *
 * @static
 * @property {Function} use
 */

exports = module.exports = Query;

/**
 * A collection of helper utilities
 *
 * @static
 * @property {Object} utils
 */
exports.utils = utils;

/**
 * The configuration object
 *
 * @static
 * @property {Object} config
 *           @param {String} defaults.defaultHttpMethod="GET" The default HTTP method
 */
exports.config = config;
