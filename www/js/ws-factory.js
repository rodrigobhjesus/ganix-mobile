module.exports = function($http) {
 
  var BASE_URL = 'http://54.94.168.2:50201/API/';
  var ESTABLISHMENT_SERVICE_NAME = 'Establishment';
  
  var markers = [ {
				establishmentId: 1,
				cnpj : 1234234,
				establishmentType : "<null>",
				fantasyName : "Woods Curitiba",
				latitude : "-25.4486974",
				longitude : "-49.30504215",
				manQuantity : 1,
				quantityLimit : 100,
				serviceVersion : "1.0.0",
				ticketValue : 70,
				womanQuantity : 1
			}, {
				establishmentId: 2,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Shed Bar",
				latitude : "-25.443690",
				longitude : "-49.294617",
				manQuantity : 100,
				quantityLimit : 300,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 50
			}, {
				establishmentId: 3,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Santa Marta",
				latitude : "-25.444065",
				longitude : "-49.292422",
				manQuantity : 50,
				quantityLimit : 300,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 50
			}, {
				establishmentId: 4,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Bar do Alemão",
				latitude : "-25.427790",
				longitude : "-49.272668",
				manQuantity : 10,
				quantityLimit : 300,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 20
			}, {
				establishmentId: 5,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Holmilk Modafocka",
				latitude : "-25.448912",
				longitude : "-49.253932",
				manQuantity : 200,
				quantityLimit : 1000,
				serviceVersion : "1.0.0",
				ticketValue : 50,
				womanQuantity : 666
			}, {
				establishmentId: 6,
				cnpj : 12502812000114,
				establishmentType : "<null>",
				fantasyName : "Paragobala",
				latitude : "-2.992615",
				longitude : "-47.356029", 
				manQuantity : 300,
				quantityLimit : 1000,
				serviceVersion : "1.0.0",
				ticketValue : 20,
				womanQuantity : 600
			}  ];
  
  return {
    /*listEstablishmentMap: function(){
      return $http.get(BASE_URL + ESTABLISHMENT_SERVICE_NAME + "/ListEstablishmentMap").then(function(response){
          return response;
      });
    },*/
	listEstablishmentMap: function(){
		return markers;
	},
    establishmentDetail: function(establishmentId){
      return {
				"establishmentId":establishmentId,
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
        return {"urls": ["https://arautodecristo777.files.wordpress.com/2013/12/balada.jpg",
							"http://img.elo7.com.br/product/original/631490/painel-balada.jpg", 
							"http://mulhersemvergonha.com/wp-content/uploads/2016/02/mulher-dancando-53608.jpg", 
							"http://blog.sympla.com.br/wp-content/uploads/2013/10/iStock_000010828750Large.jpg"
						]
				};
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