var q = require( "q" ),
  _ = require( "underscore" );

exports.data = {

  "people": [ {
    "name": "david"
  } ]

};

exports.request = function ( payload ) {
  var defer = q.defer();

  setTimeout( function () {
    defer.resolve( _.findWhere( exports.data.people, {
      name: payload.data.name
    } ) );
  }, 10 );

  return defer.promise;
};