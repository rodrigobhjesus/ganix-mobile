/* global module */
/* global angular */

'use strict';
module.exports = ['$scope', 'GanixWS', '$ionicSlideBoxDelegate', '$stateParams', function($scope, GanixWS, $ionicSlideBoxDelegate, $stateParams){
    var establishmentId = $stateParams.establishmentId;
    $scope.establishmentDetail = GanixWS.establishmentDetail(establishmentId);
    $scope.capacityDetail = GanixWS.capacityDetail();
    $scope.promotionDetail = GanixWS.promotionDetail();
    $scope.addressDetail = GanixWS.addressDetail();
    $scope.contactDetail = GanixWS.contactDetail();
    $scope.imageDetail = GanixWS.imageDetail();
    
    $scope.isOpened = function(){return "aberto agora"};
    
    $scope.groups = [];
        
    $scope.groups[0] = {
        name: "Promoções",
        items: ["Promo 01", "Promo 02"]
    };

    $scope.groups[1] = {
        name: "Contatos",
        items: []
    };

    $scope.groups[2] = {
        name: "Endereços",
        items: []
    };

    $scope.groups[3] = {
        name: "Ambiente",
        items: []
    };

    $scope.groups[4] = {
        name: "Ritmos",
        items: []
    };

    $scope.groups[5] = {
        name: "Próximos Eventos",
        items: []
    };
    
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
    
}];