(function (module) {
    mifosX.directives = _.extend(module, {
        AgeLimitDirective: function ($filter, $locale, dateFilter) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {

                    function testDateForAgeLimit(attributes,controller){
                        var minAge = attributes.minage ? attributes.minage : 18;
                        var maxAge = attributes.maxage ? attributes.maxage : 75;
                        var viewValue = controller.$viewValue;
                        var viewValueDate = new Date(viewValue);
                        var viewValue = ("0" + viewValueDate.getDate()).slice(-2) + "/" + ("0" + (viewValueDate.getMonth() + 1)).slice(-2) + "/" + viewValueDate.getFullYear();
                        var date;
                        if(viewValue == undefined) return false;
                        var dsplit = viewValue.split("/");
                        if(dsplit.length != 3){
                            controller.$setValidity('ageLimit', false);
                            return undefined;
                        } else {
                            if(parseInt(dsplit[1])>12 || parseInt(dsplit[1])<1){
                                controller.$setValidity('ageLimit', false);
                                return undefined;
                            }
                            date = new Date(parseInt(dsplit[2]),parseInt(dsplit[1])-1,parseInt(dsplit[0]));
                        }

                        //console.log(controller.$modelValue);
                        //console.log("Logging evaluated date");
                        //console.log(date);
                        if(isNaN(date)){
                            //Make it invalid
//                            console.log("marking invalid since not a date");
                            controller.$setValidity('ageLimit', false);
                            return undefined;
                        }
                        var minDate = new Date();
                        minDate.setHours(0,0,0,0);
                        minDate = minDate.setFullYear(minDate.getFullYear() - maxAge);
                        var maxDate = new Date();
                        maxDate.setHours(0,0,0,0);
                        maxDate = maxDate.setFullYear(maxDate.getFullYear() - minAge);
                        if (date <= maxDate && date >= minDate) {
                            // it is valid
                            controller.$setValidity('ageLimit', true);
                            return date;
                        } else {
                            // it is invalid, return undefined (no model update)
                           // console.log("marking invalid since not in range");
                            controller.$setValidity('ageLimit', false);
                            return undefined;
                        }
                    }
                    scope.$watch(function(){ return ctrl.$modelValue},function(){
                        testDateForAgeLimit(attrs,ctrl);
                    });
                    ctrl.$parsers.unshift(function(viewValue) {
                       // console.log("Called parser");
                        return testDateForAgeLimit(attrs,ctrl);
                    });
                }
            }
        }
    });
}(mifosX.directives || {}));
mifosX.ng.application.directive("ageLimit", ['$filter', '$locale', 'dateFilter', mifosX.directives.AgeLimitDirective]).run(function ($log) {
    $log.info("AgeLimitDirective initialized");
});

