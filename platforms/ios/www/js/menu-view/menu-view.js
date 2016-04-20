/* global module */
/* global angular */
'use strict';

module.exports = angular.module('Menu', [])
                        .controller('MenuCtrl', require('./menu-controller'))
                        .directive('aboutView', require('./dv-about-view'));