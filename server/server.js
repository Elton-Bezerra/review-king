var express = require('express');
var app     = express(); // create our app w/ express
var mongoose = require('mongoose'); //mongoose for mongodb
var morgan = require('morgan'); //log request to the console
var bodyParser = require('body-parser'); //pull information from html post
var methodOverride = require('method-override'); //simulate delete and put
var cors = require('cors');

//configuration
mongoose.connect('mongodb://localhost/reviewking');

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'Delete, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Models
var Review = mongoose.model('Review', {
    title: String,
    description: String,
    rating: Number
});

//Routes
app.get('/api/reviews', function(req, res) {
    console.log("fetching reviews");

    // use mongoose to get all reviews in the database
    Review.find(function(err, reviews){
        //if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if(err) res.send(err);
        console.log(reviews);
        res.json(reviews); // return all reviews in json format
    });
});

// create review and send back all reviews after creation
app.post('/api/reviews', function(req, res){
    console.log("creating review");
    
    // create review, information comes from request from Ionic
    Review.create({
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
        done: false
    }, function(err, review){
        if(err) res.send(err);

        //get and return all the reviews after you create another

        Review.find(function(err, reviews){
            if(err) res.send(err);
            res.json(reviews);
        });
    });    
});

//delete a review
app.delete('/api/reviews/:review_id', function(req, res){
    Review.remove({
        _id: req.params.review_id
    }, function(err, review){

    });
});

//listen (start app with node server.js) =======
app.listen(8080);
console.log("App listening on port 8080");