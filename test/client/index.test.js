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

      done();

    } ).fail( done );

  } );

  // TODO: more tests!

} );