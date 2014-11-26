var Query = require( ".." ),
  should = require( "should" ),
  sinon = require( "sinon" ),
  utils = require( "../utils" ),
  dummy = require( "./dummy" ),
  pick = require( "sc-pick" );

describe( "sc-query", function () {

  it( "adding parameters", function () {
    var personQuery = new Query( "/person" );

    personQuery.parameters().should.eql( {} );
    personQuery.parameters( pick( dummy.data.people[ 0 ], [ "name", "gender" ] ) );
    Object.keys( personQuery.__parameters ).should.eql( [ "name", "gender" ] );

  } );

  it( "new parameters should merge in to the the existing", function () {
    var personQuery = new Query( "/person" );

    personQuery.parameters().should.eql( {} );
    personQuery.parameters( pick( dummy.data.people[ 0 ], [ "name", "gender" ] ) );
    Object.keys( personQuery.__parameters ).should.eql( [ "name", "gender" ] );
    personQuery.parameters( pick( dummy.data.people[ 0 ], [ "guid", "isActive" ] ) );
    Object.keys( personQuery.__parameters ).should.eql( [ "name", "gender", "guid", "isActive" ] );

    [ "name", "gender", "guid", "isActive" ].forEach( function ( key ) {
      personQuery.__parameters[ key ].should.eql( dummy.data.people[ 0 ][ key ] );
    } );

  } );

  it( "new headers should merge in to the the existing", function () {
    var headers = {
      "x-request-with": "test"
    };
    var personQuery = new Query( "/person", "GET", { headers: headers } );

    personQuery.__headers["x-request-with"].should.eql("test");
    
    personQuery.header("x-request-with2", "test");

    personQuery.__headers["x-request-with2"].should.eql("test");
  } );

} );