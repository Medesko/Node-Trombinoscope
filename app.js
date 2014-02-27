
/**
 * Module dependencies.
 */
 const fbId = "";
 const fbSecret = "";
 const fbCallbacck = "http://127.0.0.1:3000/auth/facebook";


var express = require('express');
var routes = require('./routes');
var medias = require('./routes/medias');
var http = require('http');
var path = require('path');

// mongodb
var mongo = require( 'mongodb' );
var db = mongo.MongoClient;

// Instanciate the express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Middlewares
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// URL routes
app.get( '/', routes.index );
// Liste des devises
app.get( "/devises", routes.devises( db ) );
app.get('/medias', medias.medias);
app.get('/medias/add_photo', medias.addphotos(db));
app.get('/medias/add_musique', medias.addmusiques);
app.get('/medias/add_film', medias.addfilms);

// Une devise
app.get( "/devise/:id", routes.devise( db ) );

// Launch application
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
