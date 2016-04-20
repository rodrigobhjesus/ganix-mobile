/* global google */
/* global module */
/* global angular */
module.exports = ['$cordovaGeolocation', '$rootScope', 'LoadPage', 'GanixWS', function($cordovaGeolocation, $rootScope, LoadPage, GanixWS){
        console.log('passou 0');
        var map = null;
        var initMap = function(){
        var options = {timeout: 10000, enableHighAccuracy: true};
        console.log('passou 1');
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Wait until the map is loaded
            google.maps.event.addListenerOnce(map, 'idle', function(){
                //Load the markers
                loadMarkers();
            });
            console.log('passou 2');
        }, 
    
        function(error){
            console.log("Could not get location");
            
            //Load the markers
            loadMarkers();
        });
 
    };
 
    var loadMarkers = function(){
        //Get all of the markers from our Markers factory
        console.log('passou 3');
        GanixWS.listEstablishmentMap().then(function(markers){
            var records = markers.data;
            for (var i = 0; i < records.length; i++) {
              var record = records[i];
                
              var markerPos = new google.maps.LatLng(record.latitude, record.longitude);
             
              var imageName = '././img/pin';
              var imageExtName = '.png';
              
              var peopleQuantity = record.manQuantity + record.womanQuantity;
              var percPessoas =  (peopleQuantity / record.quantityLimit) * 100;
              
              var percName = '0';
                if (percPessoas === 0) {
                    percName = "0";
                } else if (percPessoas <= 20) {
                    percName = "20";
                } else if (percPessoas <= 40) {
                    percName = "40";
                } else if (percPessoas <= 60) {
                    percName = "60";
                } else if (percPessoas <= 80) {
                    percName = "80";
                } else {
                    percName = "100";
                }
              
              // Add the markerto the map
              var marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: markerPos,
                  icon: {
                    url: imageName + percName + imageExtName,
                    origin: new google.maps.Point(0,0),
                    scaledSize: new google.maps.Size(40,52)
                  }
              });
              var content = '<annotation-map></annotation-map>';
              var infoWindow = new google.maps.InfoWindow();
              addInfoWindow(marker, record, infoWindow, content);
            }
        }); 
    };
 
    var addInfoWindow = function(marker, record, infoWindow, content) {
        
      google.maps.event.addListener(marker, 'click', function(){
          var newScope = $rootScope.$new();
          newScope.record = record;
          var compiledContent = LoadPage.loadHTmlPage(content, newScope);
          infoWindow.setContent(compiledContent);
          infoWindow.open( map , marker );
      });
    };
    
    return {
        init: function(){
            console.log('passou -1');
            initMap();
            console.log('passou 000');
        }
    };
}];
