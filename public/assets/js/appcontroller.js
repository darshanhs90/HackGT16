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
	   	createMarker(start,3);
	}
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
          parking: {
            icon: iconBase + 'parking_lot_maps.png'
          },
          library: {
            icon: iconBase + 'library_maps.png'
          },
          info: {
            icon: iconBase + 'info-i_maps.png'
          }
        };
	function createMarker(latlng,value) {
		var icn;
	    if(value==2)
	    	icn=icons.parking.icon;
	    else if(value==1)
	    	icn=icons.info.icon;
	    else
	    	icn="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
	    var marker = new google.maps.Marker({
	        position: latlng,
	        icon:icn,
	        map: map
	    });
	    if(value==2)
	        google.maps.event.addListener(marker, 'click', (function (marker, i) {
	            return function () {

	                var html = '';

	                // Create a container for the infowindow content
	                html += '<div class="infowindow-content">';

	                // Add a link
	                html += '<a href="#">Request Cash </a><br />';
	                html += '<span>Rating 4.6</span><br />';
	                // Close the container
	                html += '</div>';

	                infowindow.setContent(html);
	                infowindow.open(map, marker);
	            }
	        })(marker, 0));
	}
	function makeInfoWindowEvent(map, infowindow, contentString, marker) {
	  google.maps.event.addListener(marker, 'click', function() {
	    infowindow.setContent(contentString);
	    infowindow.open(map, marker);
	  });
	}
	initializeMaps();
	//api call part
	//get places
	$scope.mainData=[];
	$scope.funPlaces=[],$scope.historicPlaces=[];
	$scope.getPlaces=function(val){
		$http.get('/googleSearch?type='+val+'&location='+$scope.mainPlace).success(function(data, status) {
			if(val=='1'){
				$scope.funPlaces=data;
			}
			else{
				$scope.historicPlaces=data;
			}
			$scope.mainData=data;
			console.log(data);
	    });
	}
	//get cuisine
	$scope.selected='';
	$scope.lunchPlaces=[],$scope.dinnerPlaces=[],$scope.usersList=[],$scope.atmList=[];
	$scope.getLunchCuisine=function(){
		var type=($scope.selectedLunch);
		$http.get('/yelpSearch?location='+$scope.mainData[0].formatted_address+'&type='+type).success(function(data, status) {
			$scope.lunchPlaces=(data);
	    });
	}
	$scope.getDinnerCuisine=function(){
		var type=($scope.selectedDinner);
		console.log($scope.mainData);
		$http.get('/yelpSearch?location='+$scope.mainData[2].formatted_address+'&type='+type).success(function(data, status) {
			$scope.dinnerPlaces=(data);
			console.log(data);
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
  	var infowindow = new google.maps.InfoWindow();
    $scope.getCash=function(){

    	$scope.paytab=!$scope.paytab;

    	var lat='',lng='';
    	$http.get('http://maps.googleapis.com/maps/api/geocode/json?address='+$scope.mainPlace)
    	.success(function(data, status) {
    		console.log(data);
    		lat=data.results[0].geometry.location.lat;
    		lng=data.results[0].geometry.location.lng;
	    	$http.get('/getListOfAtms?lat='+lat+'&lng='+lng).success(function(data, status) {
				$scope.atmList=data.data;
				console.log(data);
				for (var i = data.length - 1; i >= 0; i--) {
					createMarker(new google.maps.LatLng(data[i].geocode.lat, data[i].geocode.lng),1);
				};
		    });
	    	$http.get('/getListOfUsers?lat='+lat+'&lng='+lng).success(function(data, status) {
				$scope.usersList=data;
				for (var i = data.length - 1; i >= 0; i--) {
					createMarker(new google.maps.LatLng(data[i].lat, data[i].lng),2);
				};
		    });
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


	$scope.generateMap=function(){
		$scope.arr=[];
		$scope.arr.push(new google.maps.LatLng($scope.mainData[0].geometry.location.lat,$scope.mainData[0].geometry.location.lng));
		$scope.arr.push(new google.maps.LatLng($scope.lunchPlaces[0].location.coordinate.latitude,$scope.lunchPlaces[0].location.coordinate.longitude));
		$scope.arr.push(new google.maps.LatLng($scope.mainData[1].geometry.location.lat,$scope.mainData[1].geometry.location.lng));
		$scope.arr.push(new google.maps.LatLng($scope.mainData[2].geometry.location.lat,$scope.mainData[2].geometry.location.lng));
		$scope.arr.push(new google.maps.LatLng($scope.lunchPlaces[1].location.coordinate.latitude,$scope.lunchPlaces[1].location.coordinate.longitude));

		start = $scope.arr[0];
	    end = $scope.arr[4];
		map.setCenter(start);
	    var waypts = [];

	    stop = $scope.arr[1]
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = $scope.arr[2]
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
	    stop = $scope.arr[3]
	    waypts.push({
	        location: stop,
	        stopover: true
	    });
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
	   	createMarker(start,3);
	}



	$scope.getChecked=function(){
		if ($('input[name=dinnerPlaces]:checked').length > 0) {
    // do something here
    		console.log(input[name=dinnerPlaces]);
		}
	}




});
