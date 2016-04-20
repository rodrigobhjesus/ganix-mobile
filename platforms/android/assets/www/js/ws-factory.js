module.exports = function($http) {
 
  var BASE_URL = 'http://54.94.168.2:50201/API/';
  var ESTABLISHMENT_SERVICE_NAME = 'Establishment';
 
  return {
    listEstablishmentMap: function(){
      return $http.get(BASE_URL + ESTABLISHMENT_SERVICE_NAME + "/ListEstablishmentMap").then(function(response){
          return response;
      });
    },
    establishmentDetail: function(){
      return {
                "establishmentName":"Nome do Estabelecimento",
                "establishmentTags":"Bar, Balada, Happy Hour, MPB", 
                "establishmentDescription":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eleifend vitae turpis pellentesque imperdiet. Nam ultricies suscipit porttitor. Aliquam eleifend lacinia tristique. Fusce ornare augue tortor, ut laoreet mi cursus a. In dignissim quis mi et varius. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis finibus lorem a urna sodales malesuada. Cras a nisl pellentesque felis lobortis malesuada vel vel ante." ,
                "startTime": "21:00", 
                "endTime": "01:00",
                "distance": "5",
                "distanceUnit":"km",
                "ticketValue":"25"
             };
    },
    capacityDetail: function(){
      return {
                "womanQuantity":"75", 
                "manQuantity": "50", 
                "estimedQuantity": "140",
                "totalQuantity": "200"
             };
    },
    promotionDetail: function(){
        return {
                    "promotionDescriptions": ["promotion description one","promotion description two","promotion description three"]
               };
    },
    addressDetail: function(){
        return {
                    "street":"Avenida República Federativa do Brasil",
                    "number":"10000",
                    "neighborhood":"Jardim Amélia",
                    "complement":"Conjunto das Amexeiras",
                    "city":"São José dos Pinhais",
                    "state":"Paraná",
                    "stateCode":"PR",
                    "country":"Brasil",
                    "zipCode":"80000-000",
                    "latitude":"-46.000001",
                    "longitude":"-25.000001"
               };
    },
    imageDetail: function(){
        return {"urls": ["http://imagem1","http://imagem2", "http://imagem3", "http://imagem4"]};
    },
    contactDetail: function(){
        return {
                    "contacts":[
                        {
                            "contactType":"telephone",
                            "contactValue": "+55 41 00000-0000"
                        },
                        {
                            "contactType":"email",
                            "contactValue": "email@email.com.br"
                        },
                        {
                            "contactType":"skype",
                            "contactValue": "skypeuser"
                        },
                        {
                            "contactType":"facebook",
                            "contactValue": "www.facebook.com/userfacebook"
                        }
                    ]
               };
    }
    
  };
};