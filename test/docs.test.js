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

    personQuery.param( "name", "david" ).execute().then( function ( david ) {

      david.name.should.equal( "david" );
      _done();

    } );

  } );

} );