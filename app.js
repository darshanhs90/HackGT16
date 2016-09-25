var app = require('express')();
var express = require('express');
var request = require('request');
var cfenv = require('cfenv');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
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
app.use(bodyParser.json());

//declare variables

//start the server
app.listen(8082, '0.0.0.0', function() {
	console.log("server starting on 8081");
});

app.get('/yelpSearch', function(req, res) {

    var location=req.query.location!=undefined?req.query.location:'McCallum blvd,dallas,texas';
    var type=req.query.type!=undefined?req.query.type+' food':'food';
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
    var type=req.query.type!=undefined?req.query.type:'1';
    type=(type=='1')?'Fun':'Historic';
    var url="https://maps.googleapis.com/maps/api/place/textsearch/json?query="+type+" places of interest in "+location+"&key=AIzaSyCd7puJZ01KdcVVBHQA1iVDIaH4EtuFSqQ";
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        res.send(JSON.parse(body).results);
        res.end();
      }
    })
});
app.get('/getListOfAtms', function(req, res) {
   //http://api.reimaginebanking.com/atms?lat=38.9283&lng=-77.1753&rad=1&key=2dda58a2b24190db59957e4804090953
    var lat=req.query.lat;
    var lng=req.query.lng;

    var url="http://api.reimaginebanking.com/atms?lat="+lat+"&lng="+lng+"&rad=1&key=2dda58a2b24190db59957e4804090953";
    console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(JSON.parse(body).data);
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



app.post('/transferAmount',function(req,res){
    var requestBody=req.body;
    var body={
      "medium": "balance",
      "payee_id": "string",
      "amount": 0.01,
      "transaction_date": "2016-09-24",
      "description": "transaction"
    };
    body.payee_id=requestBody.payee;
    body.amount=requestBody.amount;
    var mainCustomerId="57e6e4ccdbd8355714612575";
    var query="http://api.reimaginebanking.com/accounts/";
    request('http://www.google.com',{body:body}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
      }
    })


})
//google maps https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyDlBRNWsTKZK81VHB_CZG8mWsnDeYJCEH8


