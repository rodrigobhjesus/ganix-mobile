/*global module*/
/*global angular*/
module.exports = function($compile) {
    
    return {
        loadHTmlPage: function(htmlText, scope){
                // Step 1: parse HTML into DOM element
                var template = angular.element(htmlText);
                
                // Step 2: compile the template
                var linkFn = $compile(template);

                // Step 3: link the compiled template with the scope.
                var element = linkFn(scope);
                
                scope.$safeApply();
                
                return element[0];
        }
    };
};