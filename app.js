var app = require('express')();
var express = require('express');
var request = require('request');
var cfenv = require('cfenv');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var ejs=require("ejs");



//setup the server paths
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.use( bodyParser.json() );

//declare variables


//start the server
app.listen(8081, '0.0.0.0', function() {
	console.log("server starting on 8081");
});

app.get('/distinctCities', function(req, res) {
   
});

app.post('/getUtilization1', function(req, res) {
   
});



