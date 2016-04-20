/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', '$ionicSlideBoxDelegate', function($scope, $ionicSlideBoxDelegate){

    $scope.showpage = function(index){$ionicSlideBoxDelegate.slide(index);};

}];