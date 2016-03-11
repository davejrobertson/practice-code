var app = angular.module('vehicleMgmt', []);


//Service for creating and managing Vehicle objects
app.service('VehicleService', function () {

	//Vehicle constructor function
	var Vehicle = function (type, make, model, reg, wheels, passengers) {
		this.available = true;
		this.type = type;
		this.make = make;
		this.model = model;
		this.reg = reg;
		this.wheels = wheels;
		this.passengers = passengers;
		this.assignedTo = undefined;
	};


	//declaring the list of vehicles to be used for results list
	this.vehicles = new Array();

	//create a new instance of Vehicle and push into result list
	this.addVehicle = function(type, make, model, reg, wheels, passengers) {

		var vehicle = new Vehicle(type, make, model, reg, wheels, passengers);

		this.vehicles.push(vehicle);
	};

	//remove a Vehicle from result list
	this.removeVehicle = function(index) {
		this.vehicles.splice(index, 1);
	};

	//assigning a vehicle to a customer
	this.assignVehicle = function(index, customer) {
		this.vehicles[index].assignedTo = customer;
		this.vehicles[index].available = false;
	};

	this.unassignVehicle = function(index) {
		this.vehicles[index].assignedTo = undefined;
		this.vehicles[index].available = true;
	}
	

});

//Controller for the Vehicle management app
app.controller('vehicleCtrl', function($scope, VehicleService) {

	//form js object
	$scope.form = {
		fieldCustomerEmail: undefined,
		fieldType: undefined,
		fieldMake: undefined,
		fieldModel: undefined,
		fieldReg: undefined,
		fieldWheels: undefined,
		fieldPassengers: undefined,
		addVehicle: function() {
			VehicleService.addVehicle(this.fieldType, this.fieldMake, this.fieldModel, this.fieldReg, this.fieldWheels, this.fieldPassengers);
		},
		toggleHire: function(i) {
			VehicleService.toggleHire(i);
		},
		removeVehicle: function(i) {
			VehicleService.removeVehicle(i);
		},
		assignVehicle: function() {

			for (item in this.selectedItems) {
				if (this.selectedItems[item]) {
					VehicleService.assignVehicle(item, this.fieldCustomerEmail);
				}
			}
		},
		unassignVehicle: function(i) {
			VehicleService.unassignVehicle(i);
		}
	};

	$scope.fieldRadioSelect = 'All';

	//adding list of vehicles to scope
	$scope.vehicles = VehicleService.vehicles;

	$scope.selectedItems = new Array();


	//Setting up some initial example data
	VehicleService.addVehicle('Car', 'BMW', '1 series', 'A123 3RQ', 4, 5);
	VehicleService.addVehicle('Car', 'BMW', '3 series', 'B234 3RQ', 4, 5);
	VehicleService.addVehicle('Car', 'BMW', '5 series', 'C345 3RQ', 4, 5);
	VehicleService.addVehicle('Car', 'BMW', '7 series', 'D456 3RQ', 4, 5);

});


