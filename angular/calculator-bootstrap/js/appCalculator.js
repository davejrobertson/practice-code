var app = angular.module('myApp', []);

app.controller('calcCtrl', function($scope) {
	$scope.calc = {
			field1: null, 
			field2: null,
			fieldInput: 0,
			fieldWorking: null,
			displayWorking: false,
			selectedMethod: "sum",
			calculate: function() {
					if (this.selectedMethod === "sum") {
						return this.field1 + this.field2;
					}
					else if (this.selectedMethod === "multiply") {
						return this.field1 * this.field2;
					};
				},
			display: function() {
					if (this.displayWorking === true) {
						return this.fieldWorking;
					}
					else {
						return this.fieldInput;
					}
				},
			calculateWorking: function() {
					if (this.selectedMethod === "sum") {
						return this.fieldWorking + this.fieldVariable2;
					}
					else if (this.selectedMethod === "subtract") {
						return this.fieldWorking - this.fieldVariable2;
					}
					else if (this.selectedMethod === "multiply") {
						return this.fieldWorking * this.fieldVariable2;
					}
					else if (this.selectedMethod === "divide") {
						return this.fieldWorking / this.fieldVariable2;
					}
				},
			pressOperator: function(newCalcmethod) {

					//if input field is being displayed, then copy input to formula variable
					if (this.displayWorking === false) {
						this.fieldVariable2 = this.fieldInput;

						//calculate and then display result
						this.fieldWorking = this.calculateWorking();
						this.displayWorking = true;
					}

					//then prep for further input
					this.selectedMethod = newCalcmethod;
					this.fieldInput = 0;
					
				},
			pressClear: function() {
					this.fieldVariable2 = 0;
					this.fieldInput = 0;
					this.fieldWorking = null;
					this.selectedMethod = "sum";
					this.displayWorking = false;
				},
			pressEquals: function() {

					//if working field is being displayed, then copy input to formula variable
					if (this.displayWorking === false) {
						this.fieldVariable2 = this.fieldInput;
					}

					//calculate and then display result
					this.fieldWorking = this.calculateWorking();
					this.displayWorking = true;

					//then prep for further input without changing the calculation method
					this.fieldInput = 0;

				},
			inputNo: function(number) {
					//show the number being entered
					this.displayWorking = false;

					//change the input to a string so it can be concatenated onto the end
					var inputField = this.fieldInput;
					var inputString = inputField.toString();

					inputString = inputString + number;

					//put the resultant concatenated string back into the input field
					this.fieldInput = Number(inputString);


				}
		};

    $scope.name = "David";

});