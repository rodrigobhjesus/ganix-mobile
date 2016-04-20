/* global google */
/* global module */
/* global angular */

'use strict';
module.exports = [
		'$scope',
		'$state',
		'$cordovaGeolocation',
		'GanixWS'
		function($scope, $state, $cordovaGeolocation, GanixWS) {
			var options = {
				timeout : 10000,
				enableHighAccuracy : true
			};

			$cordovaGeolocation.getCurrentPosition(options).then(
					function(position) {
						var latLng = new google.maps.LatLng(
								position.coords.latitude,
								position.coords.longitude);

						var mapOptions = {
							center : latLng,
							zoom : 15,
							mapTypeId : google.maps.MapTypeId.ROADMAP
						};

						$scope.map = new google.maps.Map(document
								.getElementById("map"), mapOptions);
								
						var markers = null;
						
						for (var i = 0; i < markers.length; i++) {
							var establishment = markers[i];
							var position = new google.maps.LatLng(
									establishment.latitude,
									establishment.longitude);
							
							var percent = ((establishment.manQuantity + establishment.womanQuantity) / establishment.quantityLimit) * 100;
							var urlPin = '../../img/pin';
							
							if(percent === 0)
								urlPin += '0';
							else if(percent <= 20)
								urlPin += '20';
							else if(percent <= 40)
								urlPin += '40';
							else if(percent <= 60)
								urlPin += '60';
							else if(percent <= 80)
								urlPin += '80';
							else
								urlPin += '100';
							
							urlPin += '.png';
							
							var marker = new google.maps.Marker({
								position : position,
								map : $scope.map,
								animation : google.maps.Animation.DROP,
								title : establishment.fantasyName,
								icon : {
									url : urlPin,
									origin : new google.maps.Point(0, 0),
									scaledSize : new google.maps.Size(40, 52)
								}
							});
						}

						// var myLatlng = {
						// lat : -25.448912,
						// lng : -49.253932
						// };
						// var marker = new google.maps.Marker({
						// position : myLatlng,
						// map : $scope.map,
						// animation : google.maps.Animation.DROP,
						// title : 'Hotmilk',
						// icon : {
						// url : '../../img/pin80.png',
						// origin : new google.maps.Point(0, 0),
						// scaledSize : new google.maps.Size(40, 52)
						// }
						// });
						//
						// marker.addListener('click', function() {
						// $scope.map.setZoom(0);
						// $scope.map.setCenter(marker.getPosition());
						// });

					}, function(error) {
						console.log("Could not get location");
					});
		} ];