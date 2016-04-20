/*global module*/
'use strict';
module.exports = function(){
    return{
      restrict: 'E',
      templateUrl: function(element,attributes) {
           return './templates/help-view/' + attributes.pagename + '.html';
       }
    };
};