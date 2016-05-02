/* global module */
/* global angular */
'use strict';

module.exports = angular.module('Filter', [])
        .controller('FilterCtrl', require('./filter-controller'));