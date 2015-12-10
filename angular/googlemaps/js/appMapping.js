var app = angular.module('mapping', []);

app.controller('mapCtrl', function($window, $scope, $http) {
	var geocodeCount = 0;
	$scope.gmaps = {
			map: undefined,
			geocoder: undefined,
			startAddress: undefined,
			addMarker: function(customer, index) {

					if (index < 5) {
						var address = customer.City + ", " + customer.Country;

						this.geocoder.geocode( { 'address': address}, function(results, status) {
								var map = $scope.gmaps.map;
								//If geocoded successfully, then add a marker
								if (status == google.maps.GeocoderStatus.OK) {

									map.setCenter(results[0].geometry.location);

									var marker = new google.maps.Marker({
										map: map,
										position: results[0].geometry.location
									});

								}
								else {
									alert('error: ' + status);
								}

							});
					}

					return index;
				},
			test: function() {
				return 1;
			}
		};

	$window.initMap = function() {

			var gmaps = $scope.gmaps

			gmaps.geocoder = new google.maps.Geocoder();

			gmaps.map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: -34.397, lng: 150.644},
					zoom: 1
				});

			$http.get("http://www.w3schools.com/angular/customers.php").then(function (response) {
					$scope.customers = response.data.records;

					for (cust in $scope.customers) {
						cust.lat
					}
				});

		};

});
