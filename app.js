var app = require('express')();
var express = require('express');
var request = require('request');
var cfenv = require('cfenv');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var ejs=require("ejs");
var Yelp = require('yelp');


//setup the server paths
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.use( bodyParser.json() );

var yelp = new Yelp({
  consumer_key: 'consumer-key',
  consumer_secret: 'consumer-secret',
  token: 'token',
  token_secret: 'token-secret',
});

//declare variables


//start the server
app.listen(8081, '0.0.0.0', function() {
	console.log("server starting on 8081");
});

app.get('/yelpSearch', function(req, res) {
   
    // See http://www.yelp.com/developers/documentation/v2/search_api
    yelp.search({ term: 'food', location: 'Montreal' })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.post('/getUtilization1', function(req, res) {
   
});



