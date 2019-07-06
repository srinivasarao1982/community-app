(function (module) {
    mifosX.controllers = _.extend(module, {
        CbStatusCheckController: function (scope, routeParams, resourceFactory, dateFilter, location) {

            scope.requestvalue=true;
             var param={};
            param.clientId =routeParams.id;
            param.valufor ='request';
            param.clientcbcheck=true;
            scope.val='request';
            scope.requestvalue=true;
            resourceFactory.rblvalidationresource.get(param,function(data){
                scope.creditBureauResults=data;
            })

            scope.valueFor=function(val){
                scope.val=val;
            }




            scope.submit=function() {
                var param={};
                param.clientId =routeParams.id;
                param.valufor =scope.val;
                param.clientcbcheck=true;
                if(param.valufor=='response'){
                    scope.requestvalue=false;
                }
                if(param.valufor=='Error'){
                    scope.requestvalue=true;
                }
                resourceFactory.rblvalidationresource.get(param,function(data){

                    scope.creditBureauResults=data;
                })

        }
    }});
    mifosX.ng.application.controller('CbStatusCheckController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.CbStatusCheckController]).run(function ($log) {
        $log.info("CbStatusCheckController initialized");
    });
}(mifosX.controllers || {}));
