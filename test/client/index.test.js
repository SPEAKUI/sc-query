var Query = scquery;

var config = {
  defaults: {
    defaultHttpMethod: "get"
  }
};

describe( "Query", function () {

  it( "should set a parameter", function () {

    var query = new Query( "http://localhost:3000/api/test", "get" );

    query.parameter( "color", "red" ).parameter( "chicken", "tasty" );

    query.__parameters.color.should.equal( query.parameter( "color" ) );
    query.__parameters.chicken.should.equal( query.parameter( "chicken" ) );
    Object.keys( query.__parameters ).should.have.a.lengthOf( 2 );

  } );

  it( "should set a default type if one is not passed", function () {

    var query = new Query();

    query.should.have.a.property( "type", config.defaults.defaultHttpMethod );

  } );

  it( "should set options", function () {

    var query = new Query( "http://localhost:3000/api/test", "get" );

    query.option( "color", "red" );
    query.options.should.have.a.property( "color", "red" );
    query.option( "chicken", "tasty" ).option( "lychee", "yummy" );
    query.options.should.have.a.property( "chicken", "tasty" );
    query.options.should.have.a.property( "lychee", "yummy" );

  } );

  it( "should return a promise and execute", function ( done ) {

    var query = new Query( "http://localhost:3000/api/food", "post", {
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

    var query = new Query( "http://localhost:3000/api/food", "post", {
      single: true
    } );

    Query.use( "postRequest", function ( _res, _next ) {

      _res.chicken = "really tasty";
      _next( null, _res );

    } );

    Query.use( "postRequest", function ( _error, _res, _next ) {

      _res.duck = "delicious";
      _next( _error, _res );

    } );

    query.parameter( "lychee", "yummy" ).parameter( "test", "one" ).parameter( "chicken", "tasty" ).execute().then( function ( res ) {

      Object.keys( res ).should.have.a.lengthOf( 4 );

      res.should.have.a.property( "lychee", "yummy" );
      res.should.have.a.property( "test", "one" );
      res.should.have.a.property( "chicken", "really tasty" );
      res.should.have.a.property( "duck", "delicious" );

      Query.useify.clear();

      done();

    } ).fail( done );

  } );

  it( "should be able to add body data and querystring parameters", function ( done ) {
    var personQuery = new Query( "http://localhost:3000/api/mixed-body-querystring-data", "post" );

    personQuery.parameters( {
      "name": "david",
      "age": 30
    } );

    personQuery.query( "database", "master" );
    personQuery.query( "language", "en" );

    personQuery.execute().then( function ( res ) {

      Object.keys( res.body ).length.should.eql( 2 );
      Object.keys( res.query ).length.should.eql( 2 );

      res.body.name.should.eql( "david" );
      res.body.age.should.eql( 30 );
      res.query.database.should.eql( "master" );
      res.query.language.should.eql( "en" );

      done();

    } ).fail( done );

  } );

} );