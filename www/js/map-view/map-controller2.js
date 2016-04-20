/* global google */
/* global module */
/* global angular */

'use strict';
module.exports = [
		'$scope',
		'$state',
		'$cordovaGeolocation',
		'GanixWS',
		function($scope, $state, $cordovaGeolocation, GanixWS) {
			var map = null;
			
			var getPercent = function(percent) {
				var stringPercent = '';
				if (percent === 0)
					stringPercent = '0';
				else if (percent <= 20)
					stringPercent = '20';
				else if (percent <= 40)
					stringPercent = '40';
				else if (percent <= 60)
					stringPercent = '60';
				else if (percent <= 80)
					stringPercent = '80';
				else
					stringPercent = '100';
				
				return stringPercent;
			} ;
            
			var initMap = function() {
				var options = {
					timeout : 10000,
					enableHighAccuracy : true
				};

				$cordovaGeolocation
						.getCurrentPosition(options)
						.then(
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

									//GanixWS.listEstablishmentMap().then(function(markersResult){
										//var markers = markesResult.data;
										var markers = GanixWS.listEstablishmentMap();
										
										for (var i = 0; i < markers.length; i++) {
											var establishment = markers[i];
											var position = new google.maps.LatLng(
													establishment.latitude,
													establishment.longitude);

											var menCount = establishment.manQuantity;
											var womenCount = establishment.womanQuantity;
											var percent = ((menCount + womenCount) / establishment.quantityLimit) * 100;
											var urlPin = '../../img/pin' + getPercent(percent) + '.png';

											var marker = new google.maps.Marker(
												{
													position : position,
													map : $scope.map,
													animation : google.maps.Animation.DROP,
													title : establishment.fantasyName,
													icon : {
														url : urlPin,
														origin : new google.maps.Point(
																0, 0),
														scaledSize : new google.maps.Size(
																40, 52)
													}
												});
											
											var conteudo = '<div id="iw-container">' +
															'<div class="iw-title">' + establishment.fantasyName + '</div>' +
															'<div class="iw-content">' +
															  '<div class="iw-subTitle">R$ ' + establishment.ticketValue + ',00</div>' +
															  '<div class="iw-content-left"><span id="number">' + (menCount + womenCount) + '</span><br/>no local</div>' +
															  '<div class="iw-content-right">' +
																'<div class="iw-content-image"><img src="../img/ico_mulher.png" height="20px" alt="women"/></div>' + womenCount +
																'<div style="clear:both;"></div>' +
																'<div class="iw-content-image"><img src="../img/ico_homem.png" height="18px" alt="men"/></div>' + menCount +
															  '</div>' +
															  '<div style="clear:both;"></div>' +
															  '<div class="iw-footer"><a href="#/app/establishments/' + establishment.establishmentId + '">ver detalhes</a></div>' +
															'</div>' +
														  '</div>';

											  /*var infowindow = new google.maps.InfoWindow({
												content: conteudo	
											  });*/
											  
											  var infowindow = new google.maps.InfoWindow();
											  // Evento que fecha a infoWindow com click no mapa
											  google.maps.event.addListener($scope.map, 'click', function() {
												infowindow.close();
											  });
											  
											  google.maps.event.addListener(marker, 'click', (function(marker, conteudo, infowindow){
												  return function() {
													infowindow.setContent(conteudo);
													infowindow.open($scope.map, marker);
												  };
											  })(marker,conteudo,infowindow));

											  /*marker.addListener('click', function() {
												infowindow.open($scope.	map, marker);
											  });*/
											  
											  google.maps.event.addListener(infowindow, 'domready', function() {
  
													// Referência ao DIV que agrupa o fundo da infowindow
													var iwOuter = $('.gm-style-iw');

													/* Uma vez que o div pretendido está numa posição anterior ao div .gm-style-iw.
													* Recorremos ao jQuery e criamos uma variável iwBackground,
													* e aproveitamos a referência já existente do .gm-style-iw para obter o div anterior com .prev().
													*/
													var iwBackground = iwOuter.prev();

													// Remover o div da sombra do fundo
													iwBackground.children(':nth-child(2)').css({'display' : 'none'});

													// Remover o div de fundo branco
													iwBackground.children(':nth-child(4)').css({'display' : 'none'});

													// Desloca a infowindow 115px para a direita
													iwOuter.parent().parent().css({left: '28px'});

													// Desloca a sombra da seta a 76px da margem esquerda 
													iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

													// Desloca a seta a 76px da margem esquerda 
													iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

													// Altera a cor desejada para a sombra da cauda
													iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1', 'background-color' : '#3c9e9f'});

													// Referência ao DIV que agrupa os elementos do botão fechar
													var iwCloseBtn = iwOuter.next();

													// Aplica o efeito desejado ao botão fechar
													iwCloseBtn.css({opacity: '1', right: '20px', top: '3px', 'box-shadow': '0 0 5px #3990B9'});

													// A API aplica automaticamente 0.7 de opacidade ao botão após o evento mouseout. Esta função reverte esse evento para o valor desejado.
													iwCloseBtn.mouseout(function(){
													  $(this).css({opacity: '1'});
													});
												  });
										}	
									//});

									

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
								//	marker.addListener('click', function() {
								//	 $scope.map.setZoom(0);
									// $scope.map.setCenter(marker.getPosition());
									//});

								}, function(error) {
									console.log("Could not get location");
								});
			};
			
			var addInfoWindow = function(marker, record, infoWindow, content) {
        
			  google.maps.event.addListener(marker, 'click', function(){
				  var newScope = $rootScope.$new();
				  newScope.record = record;
				  var compiledContent = content;
				  infoWindow.setContent(compiledContent);
				  infoWindow.open( map , marker );
			  });
			};
			
            initMap();
            
		} ];