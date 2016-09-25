var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http) {

$scope.paytab=false;
	var placeSearch, autocomplete;
	$scope.mainPlace='';
	//search part
	function initialize() {
	    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
	        types: ['(regions)']
	    });

	    google.maps.event.addListener(autocomplete, 'place_changed', function () {
	        var place = autocomplete.getPlace();	        
	        $scope.mainPlace=place.formatted_address;
	    });
	}
	initialize();
	//maps part
	var directionDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	function initializeMaps() {
	    directionsDisplay = new google.maps.DirectionsRenderer({
	        suppressMarkers: true
	    });

	    var myOptions = {
	        zoom: 3,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	    }
	    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
	    directionsDisplay.setMap(map);
	    calcRoute();
	}
	function calcRoute() {

	    var waypts = [];

	    stop = new google.maps.LatLng(51.943571, 6.463856)
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = new google.maps.LatLng(51.945032, 6.465776)
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = new google.maps.LatLng(51.945538, 6.469413)
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = new google.maps.LatLng(51.947462, 6.467941)
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = new google.maps.LatLng(51.945409, 6.465562)
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = new google.maps.LatLng(51.943700, 6.462096)
	    waypts.push({
	        location: stop,
	        stopover: true
	    });

	    start = new google.maps.LatLng(51.943382, 6.463116);
	    end = new google.maps.LatLng(51.943382, 6.463116);
	    
	    createMarker(start);
	    
	    var request = {
	        origin: start,
	        destination: end,
	        waypoints: waypts,
	        optimizeWaypoints: true,
	        travelMode: google.maps.DirectionsTravelMode.WALKING
	    };

	    directionsService.route(request, function (response, status) {
	        if (status == google.maps.DirectionsStatus.OK) {
	            directionsDisplay.setDirections(response);
	            var route = response.routes[0];
	        }
	    });
	}
	function createMarker(latlng) {
	    
	    var marker = new google.maps.Marker({
	        position: latlng,
	        map: map
	    });
	}
	initializeMaps();
	//api call part
	//get places
	$scope.funPlaces=[],$scope.historicPlaces=[];
	$scope.getPlaces=function(val){
		$http.get('/googleSearch?type='+val+'&location='+$scope.mainPlace).success(function(data, status) {
			if(val=='1'){
				$scope.funPlaces=data;
			}
			else{
				$scope.historicPlaces=data;
			}
	    });
	}
	//get cuisine
	$scope.selected='';
	$scope.lunchPlaces=[],$scope.dinnerPlaces=[],$scope.usersList=[],$scope.atmList=[];
	$scope.getLunchCuisine=function(){
		var type=($scope.selectedLunch);
		$http.get('/yelpSearch?location='+$scope.mainPlace+'&type='+type).success(function(data, status) {
			$scope.lunchPlaces=(data);
	    });
	}
	$scope.getDinnerCuisine=function(){
		var type=($scope.selectedDinner);
		$http.get('/yelpSearch?location='+$scope.mainPlace+'&type='+type).success(function(data, status) {
			$scope.dinnerPlaces=(data);
	    });
	}
	navigator.geolocation.getCurrentPosition(success);
	var lat,lng;
	function success(position)
    {
		lng=(position.coords.longitude);
        lat=(position.coords.latitude);
        console.log(lat);
        console.log(lng);
    }
    $scope.getCash=function(){
    	$scope.paytab=!$scope.paytab;
    	$http.get('/getListOfAtms?lat='+lat+'&lng='+lng).success(function(data, status) {
			$scope.atmList=data.data;
			console.log(data);
	    });
    	$http.get('/getListOfUsers?lat='+lat+'&lng='+lng).success(function(data, status) {
			$scope.usersList=data;
			for (var i = data.length - 1; i >= 0; i--) {
				createMarker(new google.maps.LatLng(data[i].lat, data[i].lng));
			};
	    });
    }

function qrgen(){
		new QRCode(document.getElementById("qrcode"), "http://api.reimaginebanking.com/customers/57e701abdbd83557146125ad/accounts?key=2e12934b7e25393f8ec1387a4f90fd5e");
	}
	qrgen();

var value;
    //capital one stats
	$scope.bal=0,$scope.rew=0,$scope.trcount=0;
	$scope.getBalRew=function() {
		$http.get('/capitalBalRew').success(function(data,status) {
			$scope.bal =data[0].balance;
			$scope.rew=data[0].rewards;
			console.log(data);
		});
	}
	$scope.getTrs=function() {
		$http.get('/capitalTrs').success(function(data,status) {
			console.log(data.length);
			$scope.trcount=(data).length;
		});
	}

	$scope.transfer=function(){
		console.log($scope.amount);
		$http.post('/transferAmount',{payee:'57e6fcacdbd83557146125a7',amount:$scope.amount}).then(function(data,status) {
			console.log(data);
			$scope.paytab=!$scope.paytab;
		})
	}

	$scope.getFood=function (argument) {
		$scope.getLunchCuisine();
		$scope.getDinnerCuisine();
	}
});
