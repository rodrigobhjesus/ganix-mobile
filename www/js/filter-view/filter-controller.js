/* global google */
/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', function($scope){
	$scope.phoneNumber = '(41) 0000-0000';	
	$scope.establishmentType = 'Indiferente';
	$scope.searchType = 'Indiferente';
	
	$scope.setType = function(event){
		$scope.establishmentType = angular.element(event.target).text();
	};
	
	$scope.setSearchType = function(event){
		$scope.searchType = angular.element(event.target).text();
	};
}];