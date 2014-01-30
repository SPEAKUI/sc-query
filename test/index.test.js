var utils = require( "../utils" ),
  config = require( "../config.json" ),
  q = require( "q" ),
  Query = require( ".." ),
  sinon = require( "sinon" ),
  dummy = require( "./index.test.json" ),
  should = require( "should" );

describe( "Query", function () {

  it( "should set a parameter", function () {

    var query = new Query( "/api/test", "get" );

    query.parameter( "color", "red" ).parameter( "chicken", "tasty" );

    should.strictEqual( query.parameter( "color" ), query.parameters.color );
    should.strictEqual( query.parameter( "chicken" ), query.parameters.chicken );
    Object.keys( query.parameters ).should.have.a.lengthOf( 2 );

  } );

  it( "should set a default type if one is not passed", function () {

    var query = new Query();

    query.should.have.a.property( "type", config.defaults.defaultHttpMethod );

  } );

  it( "should set options", function () {

    var query = new Query( "/api/test", "get" );

    query.option( "color", "red" );
    query.options.should.have.a.property( "color", "red" );
    query.option( "chicken", "tasty" ).option( "lychee", "yummy" );
    query.options.should.have.a.property( "chicken", "tasty" );
    query.options.should.have.a.property( "lychee", "yummy" );

  } );

  it( "should return a promise and execute", function ( done ) {

    var query = new Query( "http://localhost:3000/api/test", "get", {
      single: true
    } );

    query.parameter( "lychee", "yummy" ).parameter( "test", "one" ).parameter( "chicken", "tasty" ).execute().then( function ( res ) {

      Object.keys( res ).should.have.a.lengthOf( 3 );

      res.should.have.a.property( "lychee", "yummy" );
      res.should.have.a.property( "test", "one" );
      res.should.have.a.property( "chicken", "tasty" );

      done();

    } ).fail( done );

  } );

  it( "should add middleware, execute and ensure the middleware has affected the response", function ( done ) {

    var query = new Query( "http://localhost:3000/api/test", "get", {
      single: true
    } );

    Query.use( function ( _res, _next ) {

      _res.chicken = "really tasty";
      _next( _res );

    } );

    Query.use( function ( _res, _next ) {

      _res.duck = "delicious";
      _next( _res );

    } );

    query.parameter( "lychee", "yummy" ).parameter( "test", "one" ).parameter( "chicken", "tasty" ).execute().then( function ( res ) {

      Object.keys( res ).should.have.a.lengthOf( 4 );

      res.should.have.a.property( "lychee", "yummy" );
      res.should.have.a.property( "test", "one" );
      res.should.have.a.property( "chicken", "really tasty" );
      res.should.have.a.property( "duck", "delicious" );

      done();

    } ).fail( done );

  } );

  // TODO: more tests!

} );