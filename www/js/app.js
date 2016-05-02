// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
require('./menu-view/menu-view');
require('./map-view/map-view');
require('./detail-view/detail-view');
require('./filter-view/filter-view');

angular.module('starter', ['ionic',
                            'ngCordova',
                            'Menu', 
                            'Map', 
							'Filter',
                            'Detail',
                            'pascalprecht.translate',
                            'starter.controllers'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu-view/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
  .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map-view/map.html',
          controller: 'MapCtrl'
        }
      }
  })
  .state('app.filter', {
      url: '/filter',
      views: {
        'menuContent': {
          templateUrl: 'templates/filter-view/filter.html',
          controller: 'FilterCtrl'
        }
      }
  })
  .state('app.detail', {
    url: '/establishments/:establishmentId',
    views: {
        'menuContent': {
            templateUrl: 'templates/detail-view/detail.html',
            controller: 'DetailCtrl'
        }
    }
  })
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise( function($injector, $location) {
            var $state = $injector.get("$state");
                $state.go("app.map");
        });
})
.config(require('./locale'))
.factory('LoadPage', require('./load-page-factory'))
.factory('GoogleMaps', require('./maps-factory'))
.factory('GanixWS', require('./ws-factory'));
