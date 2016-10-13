var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var port 	   = 	process.env.PORT || 3000;
var request = require('request');
var http = require('http');
var async = require('async');

var Coffee     = require('./models/coffee');
var Coffeeshop = require('./models/coffeeshop');

// working photo api url = https://api.foursquare.com/v2/venues/460ab8cdf964a520f1441fe3/photos?client_id=EZDAYLG3RVMJPCUUPLOEQEEFLY5CENFIVP1USEPTTPUDYLYA&client_secret=MINYVIJU5WGQSP5YFR3FEFO0GSFTZCXJYOF2MGHAFAAY3WWV&v=20160606;


//db connection
var mongoose   = require('mongoose');
mongoose.connect('mongodb://sm_awang:lagalaxy@ds011734.mlab.com:11734/awang-coffeelog'); // connect to our database
//

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// get an instance of the express Router
var router = express.Router(); 

router.use(function(req, res, next) {

    console.log('it"s alive!');

    next(); // make sure we go to the next routes and don't stop here

});



router.route('/')

	.get(function (req, res) {

		res.render('index.ejs');
		
	})

router.route('/coffee')

	.get(function (req, res) {

		Coffee.find(function (err, coffee) {

			if (err) 
				res.send(err);

			res.render('coffee.ejs', {coffee})
		})	

	})

	.post(function (req, res) {

		var coffee = new Coffee();

		coffee.roaster = req.body.roaster;
		coffee.region = req.body.region;
		coffee.note = req.body.note;

		coffee.save(function (err) {

            if (err)
            	res.send(err);

            res.redirect('/coffee');

        })

	})


router.route('/coffee/new')

	.get(function (req, res) {

		res.render('coffee-new.ejs')
		
	})


router.route('/coffee/:coffee_id/delete')

    .post(function (req, res) {

        Coffee.remove({
            _id: req.params.coffee_id
        }, function (err, coffee) {

            if (err) res.send(err);

            res.redirect('/coffee')
        })
    })

router.route('/coffee/:coffee_id')

   .get(function (req, res) {

        Coffee.findById(req.params.coffee_id, function (err, coffee) {

            if (err) 
            	res.send(err);

            res.render('coffee-id.ejs', {coffee})
        })

    })

    .post(function (req, res) {

         Coffee.findById(req.params.coffee_id, function (err, coffee) {

            if (err) res.send(err);

            coffee.roaster = req.body.roaster;
            coffee.region = req.body.region;
            coffee.note = req.body.note;

            coffee.save(function (err) {

                res.redirect('/coffee/' + req.params.coffee_id)
            })
        })
    })


router.route('/coffee/:coffee_id/edit')

   .get(function (req, res) {

        Coffee.findById(req.params.coffee_id, function (err, coffee) {

            if (err) 
            	res.send(err);

            res.render('coffee-id-edit.ejs', {coffee})
        })

    })

router.route('/api')


    .get(function (req, res) {

        res.render('search.ejs')

    })

    .post(function (req, res) {

        // var coffeeShopName = 'saints';
        var coffeeShopName = req.body.shopname;
	    var fourSqApi = 'https://api.foursquare.com/v2/venues/search?near=new york&client_id=EZDAYLG3RVMJPCUUPLOEQEEFLY5CENFIVP1USEPTTPUDYLYA&client_secret=MINYVIJU5WGQSP5YFR3FEFO0GSFTZCXJYOF2MGHAFAAY3WWV&v=20160606&categoryId=4bf58dd8d48988d1e0931735&query=';
        var completeUrl = fourSqApi + coffeeShopName;
        var photoUrl = "https://api.foursquare.com/v2/venues/460ab8cdf964a520f1441fe3/photos?client_id=EZDAYLG3RVMJPCUUPLOEQEEFLY5CENFIVP1USEPTTPUDYLYA&client_secret=MINYVIJU5WGQSP5YFR3FEFO0GSFTZCXJYOF2MGHAFAAY3WWV&v=20160606";

        // function httpGet(url, callback) {

        //     const options = {
        //         url :  url,
        //         json : true
        //     };

        //     request(options,

        //         function(err, res, body) {

        //            if (body.response.venues) {

        //             console.log('Venue info')

        //            } else {

        //             console.log('photos')
                    
        //            }

        //           callback(err, body);

        //       }

        //     );
        // }

        // const urls= [
        //     completeUrl,
        //     photoUrl
        // ];

        // async.map(urls, httpGet, function (err, res){

        //   if (err) return console.log(err);

        //   console.log(res);

        // })

		request(fourSqApi + coffeeShopName, function (error, response, body) {

			if (!error && response.statusCode == 200) {

				var results = JSON.parse(body);
				var venuesData = results.response.venues;

                // res.json({results})
				res.render('api-results.ejs', {venuesData})

			}

		})

	})

router.route('/api/test')

    .get(function (req, res) {

            function httpGet(url, callback) {

              const options = {
                url :  url,
                json : true
            };

            request(options,

                function(err, res, body) {

                  callback(err, body);

              }

            );
        }

        const urls= [
            "http://www.omdbapi.com/?t=titanic&y=&plot=short&r=json",
            "http://www.omdbapi.com/?t=batman&y=&plot=short&r=json"
        ];

        async.map(urls, httpGet, function (err, res){

          if (err) return console.log(err);

          console.log(res);

        })


    })

router.route('/coffeeshop')

    .get(function (req, res) {

        Coffeeshop.find(function (err, coffeeshop) {

            if (err) 
                res.send(err);

            res.render('coffeeshop.ejs', {coffeeshop})
        })  
    })

    .post(function (req, res) {

        var coffeeshop = new Coffeeshop();

        coffeeshop.name = req.body.name;
        coffeeshop.address = req.body.address;

        coffeeshop.save(function (err) {

            if (err)
                res.send(err);

            res.redirect('/coffeeshop');

        })
    })






// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);