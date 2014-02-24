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

} );