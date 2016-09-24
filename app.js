var app = require('express')();
var express = require('express');
var request = require('request');
var cfenv = require('cfenv');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var ejs=require("ejs");
var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: '3x6Ac1eOjZ5FCU1J9m5hAA',
  consumer_secret: 'yxNlks3UMm1ivqa_zyX9S8eXtmE',
  token: 'ytPheD8u7xVecoVv3DeJ-iwQa4LiubaG',
  token_secret: 'VfI-hbolHUSFQmQ5IoNTpy8tYdI',
});

//setup the server paths
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.use( bodyParser.json() );

var yelp = new Yelp({
  consumer_key: '3x6Ac1eOjZ5FCU1J9m5hAA',
  consumer_secret: 'yxNlks3UMm1ivqa_zyX9S8eXtmE',
  token: 'ytPheD8u7xVecoVv3DeJ-iwQa4LiubaG',
  token_secret: 'VfI-hbolHUSFQmQ5IoNTpy8tYdI',
});

//declare variables


//start the server
app.listen(8081, '0.0.0.0', function() {
	console.log("server starting on 8081");
});

app.get('/yelpSearch', function(req, res) {
   
    var location=req.query.location!=undefined?req.query.location:'McCallum blvd,dallas,texas';
    var type=req.query.type!=undefined?req.query.type:'food';
    yelp.search({ term: type, location: location })
    .then(function (data) {
      res.send(data.businesses);
      res.end();
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.get('/googleSearch', function(req, res) {
   
    var location=req.query.location!=undefined?req.query.location:'Atlanta';
    var url="https://maps.googleapis.com/maps/api/place/textsearch/json?query=places+of+interest+in+"+location+"&key=AIzaSyCd7puJZ01KdcVVBHQA1iVDIaH4EtuFSqQ";
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body.results);
        res.end();
      }
    })
});
app.get('/getListOfAtms', function(req, res) {
   //http://api.reimaginebanking.com/atms?lat=38.9283&lng=-77.1753&rad=1&key=2dda58a2b24190db59957e4804090953
    var lat=req.query.lat!=undefined?req.query.lat:'38.9283';
    var lng=req.query.lng!=undefined?req.query.lng:'-77.1753';
    
    var url="http://api.reimaginebanking.com/atms?lat="+lat+"&lng="+lng+"&rad=1&key=2dda58a2b24190db59957e4804090953";
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body.data);
        res.end();
      }
    })
});

app.get('/getListOfUsers', function(req, res) {
   //http://api.reimaginebanking.com/atms?lat=38.9283&lng=-77.1753&rad=1&key=2dda58a2b24190db59957e4804090953
    var lat=req.query.lat!=undefined?req.query.lat:38.9283;
    var lng=req.query.lng!=undefined?req.query.lng:-77.1753;
    var output=generateRandomPoints({'lat':lat, 'lng':lng}, 1000, 100); 
    res.send(output);
    res.end();
});
function generateRandomPoint(center, radius) {
  var x0 = center.lng;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  return {'lat': y+y0, 'lng': xp+x0};
}
function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}



