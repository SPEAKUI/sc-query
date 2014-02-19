# TOC
   - [sc-query](#sc-query)
<a name=""></a>
 
<a name="sc-query"></a>
# sc-query
A query module.

```js
var personQuery = new Query( "/person", "get" );
personQuery.param( "name", "david" ).execute().then( function ( david ) {
  david.name.should.equal( "david" );
  _done();
} );
```

