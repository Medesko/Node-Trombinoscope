var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable')

/*
 * GET users listing.
 */
// use lifetuner
// switched to db lifetuner
// > db.devises.insert( { text: "Pourquoi faire simple quand on peut faire compliquer ?!", "image": "d_01.jpg" } );
var photos = 
	[
		{
			"_id":"1"
			,"name":"photo-01"
			,"src":"photos/photo-01.jpg"
	    },
		{
			"_id":"2"
			,"name":"photo-02"
			,"src":"photos/photo-02.jpg"
		},
		{
			"_id":"3"
			,"name":"photo-03"
			,"src":"photos/photo-03.jpg"
		},
		{
			"_id":"4"
			,"name":"photo-04"
			,"src":"photos/photo-04.jpg"
		}
	];
var musiques = 
	[
		{
			"_id":"1"
			,"name":"musique-01"
			,"src":"musiques/halo-beyonce.jpg"
	    },
		{
			"_id":"2"
			,"name":"musique-02"
			,"src":"musiques/racine-carre-stromae.jpg"
		},
		{
			"_id":"3"
			,"name":"musique-03"
			,"src":"musiques/halo-beyonce.jpg"
		},
		{
			"_id":"4"
			,"name":"musique-04"
			,"src":"musiques/halo-beyonce.jpg"
		}
	];

var films = 
	[
		{
			"_id":"1"
			,"name":"video-01"
			,"src":"films/film-01"
	    },
		{
			"_id":"2"
			,"name":"videos-02"
			,"src":"films/film-02"
		},
		{
			"_id":"3"
			,"name":"video-03"
			,"src":"films/film-03"
		},
		{
			"_id":"4"
			,"name":"film-04"
			,"src":"films/film-04"
		}
	];

exports.medias = function(req, res){
  res.render('medias', {
   title: "Toutes les Medias", 
  	medias : {
  		photos: photos,
  		musiques: musiques,
  		films: films,
  	}
  } );
};
/**
 * Adds devise
 */
exports.addphotos = function (db) {
	return function(req, res){
		var form = new formidable.IncomingForm;

		form.parse(req, function(err, fields, files){
			if (err) return res.end('You found error');
			// do something with files.image etc
			console.log('fields', fields)
			console.log('files', files);

			// Data
			if(fields.title && files.image) {
				var ext = null;
				var image = files.image;
				switch(image.type) {
					case 'image/gif':
						ext = 'gif';
						break;
					case 'image/png':
						ext = 'png';
						break;
					default:
						ext = 'jpg';
						break;
				}

				db.connect('mongodb://127.0.0.1:27017/lifetuner', function(err, db) {
					if(err)
						throw err;
					var collection = db.collection('photos');
					var insertObj = {
						title: fields.title,
						ext: ext
					};

					collection.insert(insertObj, function(err, data) {
						if(err)
							throw err;
						
						var newPath = "public/photos/"+insertObj._id+'.'+ext;
						console.log('new path = ', newPath);
						fs.rename(image.path, newPath, function(err, data) {
							if(err)
								throw err;

							// Home
							res.render('add_photo', {message: 'Complete !'});
						});

						db.close();
					});
				});
			}
			// Form
			else {
				res.render('add_photo', {title:'Ajouter photo'});
			}
		});
	}
};
exports.addmusiques = function (req, res) {
	res.render('add_musique', {
	 title: "Ajouter musique"
	});
};
exports.addfilms = function (req, res) {
	res.render('add_film', {
	 title: "Ajouter film"
	});
};

/**
 * Liste des medias
 */

exports.findMedias = function( dbclient )
{
	// Wrapper function
	return function( req, res )
	{
		dbclient.connect
		(
			'mongodb://127.0.0.1:27017/lifetuner', function( err, db )
			{
				if( err ) throw err;
				// here find all photos render to medias
				var photos, musiques, films;
				var allmedias = function()
				{
					if( photos !== undefined &&  musiques !== undefined &&  films !== undefined 		
					 )
					{
						// retourne le template devises
						// avec les données de la base
						res.render
						(
						   "medias"
						   ,{
								title: "Toutes les Medias", 
							  	medias : {
							  		photos: photos,
							  		musiques: musiques,
							  		films: films
							  	}
						   }
						);
					}
				};
				var collection = db.collection("photos");
				collection.find().toArray
				(
					function( err, photos )
					{
						photos = photos;
						allmedias();
					}
				);
				var collection = db.collection("musiques");
				collection.find().toArray
				(
					function( err, musiques )
					{
						musiques = musiques;
						allmedias();

					}
				);
				var collection = db.collection("films");
				collection.find().toArray
				(
					function( err, films )
					{
						films = films;
						allmedias();
					}
				);
				db.close();
			}
		);
	};
};
