/* global module */
/* global angular */

'use strict';

module.exports = angular.module('Map', [])
                        .controller('MapCtrl', require('./map-controller'))
                        .directive('annotationMap', require('./dv-annotation'));