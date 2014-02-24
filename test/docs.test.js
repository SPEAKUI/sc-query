var Query = require( ".." ),
  should = require( "should" ),
  sinon = require( "sinon" ),
  utils = require( "../utils" ),
  dummy = require( "./dummy" );

describe( "sc-query", function () {

  before( function () {
    sinon.stub( utils, "request", dummy.request );
  } );

  after( function () {
    utils.request.restore();
  } );

  it( "A query module", function ( _done ) {
    var personQuery = new Query( "/person", "get" );

    personQuery.param( "name", "Kelsey Mayer" ).execute().then( function ( kelsey ) {

      kelsey.name.should.equal( "Kelsey Mayer" );
      _done();

    } );

  } );

} );