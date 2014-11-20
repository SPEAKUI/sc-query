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

app.post( "/api/mixed-body-querystring-data", function ( req, res ) {
  console.log(req.headers);
  res.json( {
    body: req.body,
    query: {
      database: req.param( "database" ),
      language: req.param( "language" )
    }
  } );
} );

app.listen( 3000 );