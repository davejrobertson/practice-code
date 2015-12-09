var app = angular.module('mapping', []);

app.controller('mapCtrl', function($scope, $http) {
	$scope.calc = {
			field1: null, 
			inputNo: function(number) {
					//show the number being entered
					this.displayWorking = false;
				}
		};

	$http.get("http://www.w3schools.com/angular/customers.php").then(function (response) {
			$scope.customers = response.data.records;
		});


});


var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}
