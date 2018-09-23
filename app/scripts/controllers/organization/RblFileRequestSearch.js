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
                if (scope.formData.fromDate) {
                    this.formData.fromDate = dateFilter(scope.formData.fromDate, 'yyyy-MM-dd');
                }
                if (scope.formData.toDate) {
                    this.formData.toDate = dateFilter(scope.formData.toDate,'yyyy-MM-dd');
                }
                if(angular.isUndefined( this.formData.fileType)){
                    this.formData.fileType='send';
                }
                //scope.formData=false;
                resourceFactory.rblvalidationFileresource.get( scope.formData,function(data){
                    scope.fileData=data;
                })
            };


        }
    });
    mifosX.ng.application.controller('RblFileRequestSearch', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location','API_VERSION','$rootScope', mifosX.controllers.RblFileRequestSearch]).run(function ($log) {
        $log.info("RblFileRequestSearch initialized");
    });
}(mifosX.controllers || {}));
