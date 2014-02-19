var express = require( 'express' ),
  app = express();

app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.logger( "dev" ) );
app.use( app.router );
app.use( express.static( __dirname + "/../" ) );

app.post( "/api/food", function ( req, res ) {
  res.json( req.body );
} );

app.listen( 3000 );