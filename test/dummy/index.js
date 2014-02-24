var q = require( "q" ),
  _ = require( "underscore" );

exports.data = {

  "people": [ {
    "id": "a1af8d5b-4a04-48d5-ad1c-1c63ac72d059",
    "guid": "e483ffb2-27f4-4dad-b6ff-5052430fcb76",
    "isActive": "4fbb2781-26b5-48ce-a559-d9968a48b10d",
    "balance": "76461fc9-cb2d-4411-91e8-8197255137ee",
    "picture": "http://placehold.it/32x32",
    "age": 33,
    "name": "Kelsey Mayer",
    "gender": "female",
    "company": "Netplax",
    "email": "kelseymayer@netplax.com",
    "phone": "+1 (878) 560-2263",
    "address": "378 Croton Loop, Tibbie, Montana, 2171",
    "about": "Velit commodo id exercitation non exercitation ut sit. Mollit commodo enim aliquip et nulla. Laborum non quis dolore consequat. Deserunt consequat occaecat nostrud minim aute cupidatat consequat reprehenderit culpa adipisicing in mollit.\r\n",
    "registered": "1991-03-24T21:27:37 -10:00",
    "latitude": -33.497489,
    "longitude": 79.157194,
    "tags": [
      "excepteur",
      "consectetur",
      "esse",
      "commodo",
      "pariatur",
      "sit",
      "cillum"
    ],
    "friends": [ {
      "id": 0,
      "name": "Jackson David"
    }, {
      "id": 1,
      "name": "Douglas Bray"
    }, {
      "id": 2,
      "name": "Josephine Caldwell"
    } ],
    "randomArrayItem": "apple"
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