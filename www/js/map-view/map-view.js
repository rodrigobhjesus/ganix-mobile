/* global module */
/* global angular */

'use strict';

module.exports = angular.module('Map', [])
                        .controller('MapCtrl', require('./map-controller2'))
                        .directive('annotationMap', require('./dv-annotation'));