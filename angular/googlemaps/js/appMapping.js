var app = angular.module('mapping', []);

app.controller('mapCtrl', function($window, $scope, $http) {
	var geocodeCount = 0;
	$scope.customers = undefined
	$scope.customerUrl = "http://www.w3schools.com/angular/customers.php";
	$scope.gmaps = {
			map: undefined,
			geocoder: undefined,
			director: undefined,
			bounds: undefined,
			startAddressDraft: undefined,
			startAddress: undefined,
			clickBtnStartAddress: function() {
				$scope.gmaps.startAddress = $scope.gmaps.startAddressDraft;

				$scope.gmaps.getMultiDirections($scope.customers);
			},
			getMultiDirections: function(customers) {
				var customers = $scope.customers;

				for (i=0; i<customers.length; i++) {
					$scope.customers[i].journeyDistance = "loading";
					$scope.customers[i].journeyTime = "loading";
					$scope.gmaps.getDirections(customers[i], i);
				}
			},
			getDirections: function(customer, index) {
					//trigger each marker request sequentially after a timeout to avoid exceeding Google query limit
					setTimeout(function(){

						var address = customer.City + ", " + customer.Country;
						var startAddress = $scope.gmaps.startAddress;
						

						//trigger re-rendering of the view
						$scope.$digest();

						var DirectionsRequest = {
								origin: startAddress,
								destination: address,
								travelMode: google.maps.TravelMode.DRIVING
							};

						$scope.gmaps.director.route(DirectionsRequest, function(response, status) {
								var customers = $scope.customers;
								var custAddress = undefined;
								var totalDistance = 0;
								var totalDuration = "";
								var legs = undefined;

								//if successful, then
								if (status === google.maps.DirectionsStatus.OK) {

									//set the display values to total distance / duration
									legs = response.routes[0].legs;

									for(i=0; i<legs.length; i++) {
									    totalDistance += legs[i].distance.value;
									    totalDuration += legs[i].duration.text;
									}

									//not displaying directions right now
									//directionsDisplay.setDirections(response);
								} else {
									//set the value to the status
									totalDistance = status;
									totalDuration = status;
								}

								//locate all applicable customer rows and apply the display value
								for (i=0; i<customers.length; i++) {
									custAddress = customers[i].City + ", " + customers[i].Country;

									if (custAddress === response.request.destination) {
										$scope.customers[i].journeyDistance = totalDistance;
										$scope.customers[i].journeyTime = totalDuration;
									}
								}

								//trigger re-rendering of the view
								$scope.$digest();
							});

					}, 500 * index);

					return undefined;
			},
			addMultiMarkers: function(customers) {
				for (i=0; i<customers.length; i++) {
					$scope.gmaps.addMarker(customers[i], i);
				}
			},
			addMarker: function(customer, index) {

					//trigger each marker request sequentially after a timeout to avoid exceeding Google query limit
					setTimeout(function(){

						var address = customer.City + ", " + customer.Country;

						$scope.gmaps.geocoder.geocode( { 'address': address}, function(results, status) {
								var map = $scope.gmaps.map;
								var bounds = $scope.gmaps.bounds;

								var latLng = results[0].geometry.location;

								//If geocoded successfully, then add a marker
								if (status == google.maps.GeocoderStatus.OK) {

									//extend the bounds and center around the intended marker location
									bounds.extend(latLng);
									map.fitBounds(bounds);

									//add the marker to the map
									var marker = new google.maps.Marker({
										map: map,
										position: latLng
									});

									$scope.customers[index].markerIndex = index;
									$scope.$digest();
								}
								else {
									alert('error: ' + status);
								}

							});
					}, 500 * index);

					return undefined;
				}
		};

	$window.initMap = function() {

			var gmaps = $scope.gmaps

			//initialising the address > coordinate service
			gmaps.geocoder = new google.maps.Geocoder();

			gmaps.director = new google.maps.DirectionsService();

			//initialising the map object
			gmaps.map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: -34.397, lng: 150.644},
					zoom: 5
				});

			//this makes zooming/centering easier when adding markers
			gmaps.bounds = new google.maps.LatLngBounds();


			//fetch some data. . address hardcoded as only a demo
			$http.get($scope.customerUrl).then(function success(response) {
					
					var customers = response.data.records;
					for (i=0; i<customers.length; i++) {
						customers[i].markerIndex = "";
						customers[i].journeyDistance = "";
						customers[i].journeyTime = "";
					}

					//add the data to the scope
					$scope.customers = customers;

					//add all customers to map
					gmaps.addMultiMarkers(customers);

				},
				function error(response){
					$scope.customers = -1;
				});

		};

});

app.filter('gMapsDistance', function($filter) {
  return function(input) {
			var html;

			if (input === "loading"){
				html = "...";
			}
			else if (input === "ZERO_RESULTS") {
				html = "Not available";
			}
			else if (input === "") {
				html = "";
			}
			else {
				html = "" + $filter('number')(input / 1000, 1) + " km";
			}

			return html;
		};
});

app.filter('gMapsTime', function() {
  return function(input) {
			var html;

			if (input === "loading"){
				html = "...";
			}
			else if (input === "ZERO_RESULTS") {
				html = "Not available";
			}
			else if (input === "") {
				html = "";
			}
			else {
				html = input;
			}

			return html;
		};
});

app.filter('gMapsDirectionClass', function() {
  return function(input) {
			var html;

			if (input === "loading"){
				html = "text-warning";
			}
			else if (input === "ZERO_RESULTS") {
				html = "text-danger";
			}
			else if (input === "") {
				html = "";
			}
			else {
				html = "text-success";
			}

			return html;
		};
});



