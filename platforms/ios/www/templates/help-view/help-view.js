/* global module */
/* global angular */
'use strict';

module.exports = angular.module('Help', [])
                        .controller('HelpCtrl', require('./help-controller'))
                        .directive('helpView', require('./dv-help-page'));