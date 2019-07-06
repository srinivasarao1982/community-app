(function (module) {
    mifosX.controllers = _.extend(module, {
        RblFileRequestSearch: function (scope, routeParams, resourceFactory, dateFilter, location,API_VERSION, $rootScope) {
            scope.fileTypes='send';

            scope.valueFor=function(val){
                this.formData.fileType=val;
                if(val=='received'){
                    scope.fileTypes='receive';
                }else{
                    scope.fileTypes='send';
                }
            }
          //  scope.url=$rootScope.hostUrl + API_VERSION + '/clients/';
          // scope.test='/root/.mifosx/Nirantara/documents/';
            scope.test = $rootScope.hostUrl + API_VERSION + '/clients/' + 4 + '/documents/' + 3 + '/rblattachment?tenantIdentifier=' + $rootScope.tenantIdentifier;

            scope.fileData=[];

            scope.submit=function() {
                scope.dateError=false;
                scope.fromDate1=false;
                scope.toDate1=false;
                if (scope.formData.fromDate) {
                    this.formData.fromDate = dateFilter(scope.formData.fromDate, 'yyyy-MM-dd');
                    scope.fromDate1=true;
                }
                if (scope.formData.toDate) {
                    this.formData.toDate = dateFilter(scope.formData.toDate,'yyyy-MM-dd');
                    scope.toDate1=true;
                }
                if(angular.isUndefined( this.formData.fileType)){
                    this.formData.fileType='send';
                }
                //scope.formData=false;
                if(scope.fromDate1 && scope.toDate1 ) {
                    resourceFactory.rblvalidationFileresource.get(scope.formData, function (data) {
                        scope.fileData = data;
                    })
                }
                else{
                    scope.dateError=true;
                }
            };


        }
    });
    mifosX.ng.application.controller('RblFileRequestSearch', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location','API_VERSION','$rootScope', mifosX.controllers.RblFileRequestSearch]).run(function ($log) {
        $log.info("RblFileRequestSearch initialized");
    });
}(mifosX.controllers || {}));
