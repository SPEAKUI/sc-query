var express = require( 'express' );
var app = express();

app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.logger( "dev" ) );

app.get( '/api/test', function ( req, res ) {
  res.json( req.body );
} );

app.listen( 3000 );