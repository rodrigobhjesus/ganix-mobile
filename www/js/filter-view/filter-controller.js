/* global google */
/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', 'GanixWS', function($scope, GanixWS){
	$scope.phoneNumber = '(41) 0000-0000';	
	$scope.establishmentType = 'Indiferente';
	$scope.searchType = 'Indiferente';
	$scope.filterTags = [
		"Woods",
		"Sertanejo",
		"Rock",
		"Pop",
		"Bar",
		"Balada",
		"Eletrônica",
		"Bar do Alemão",
		"Shed",
		"Santa Marta",
		"Barato",
		"Hotmilk",
		"Funk"	
	];
	$scope.selectedTags = [];
	
	$scope.setType = function(event){
		$scope.establishmentType = angular.element(event.target).text();
	};
	
	$scope.setSearchType = function(event){
		$scope.searchType = angular.element(event.target).text();
	};
	
	$scope.addTag = function(tagText){
		if(tagText != null && tagText != '' && !$scope.containsObject(tagText, $scope.selectedTags)) {
			$scope.selectedTags.push(tagText);
			$scope.tagText = '';
		}
	};
	
	$scope.removeTag = function(text) {
		var index = $scope.selectedTags.indexOf(text);
		$scope.selectedTags.splice(index, 1); 
	}
	
	$scope.containsObject = function(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (angular.equals(list[i], obj)) {
				return true;
			}
		}

		return false;
	};
}];