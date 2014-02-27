var ObjectId = require('mongodb').ObjectID;


/*
 * GET home page.
 */
 exports.index = function(req, res){
   res.render('index', { title: 'Facebook Connect with Node' });
 };
 
 exports.facebook = function(req, res){
 	res.render('facebook-auth', { token: 'skkkkk' });
 }

 /**
  * Liste des devises
  */
 exports.devises = function( dbclient )
 {
 	// Wrapper function
 	return function( req, res )
 	{
 		dbclient.connect
 		(
 			'mongodb://127.0.0.1:27017/shadokdb', function( err, db )
 			{
 				if( err ) throw err;

 				var collection = db.collection( "devises" );
 				collection.find().toArray
 				(
 					function( err, devises )
 					{
 						// retourne le template devises
 						// avec les données de la base
 						res.render
 						(
 						   "devises"
 						   ,{
 								title : "Toutes les devises"
 								,devises : devises
 						   }
 						);
 						

 						db.close();
 					}
 				);
 			}
 		);
 	};
 };
/**
 *	Une devise
 */
exports.devise = function( dbclient )
{
	// Wrapper function
	return function( req, res )
	{
		dbclient.connect
		(
			'mongodb://127.0.0.1:27017/shadokdb', function( err, db )
			{
				if( err ) throw err;

				var collection = db.collection( "devises" );

				collection.findOne
				(
					/* Création de la clé en fonction de sa valeur hexa */
					{ "_id": ObjectId.createFromHexString(req.params.id) }
					,function( err, devise )
					{
						console.dir( devise );
						// retourne le template devises
						// avec les données de la base
						res.render
						(
						   "devise"
						   ,{
								devise : devise
						   }
						);

						db.close();
					}
				);
			}
		);
	};
}
