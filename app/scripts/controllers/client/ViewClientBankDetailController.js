(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientBankDetailController: function (scope, location, http, routeParams, API_VERSION, $upload, $rootScope, resourceFactory,dateFilter,$modal) {
           scope.clientbankdetails = [];
           scope.clientId = null;
           scope.bankdetailId = null;
           scope.isPrimaryAccount = "NO";
           resourceFactory.clientbankDetailsResource.get({bankdetailId: routeParams.id},function (data){
                 scope.clientbankdetails = data;
                 scope.clientId = data.clientId;
                 scope.bankdetailId = routeParams.id;
                 if(scope.clientbankdetails.isPrimaryAccount == true){
                    scope.isPrimaryAccount = "YES";
                 }
           });
          scope.routeToEditClientBankDetails = function(){
              location.path('/editclientbankdetails/' + scope.bankdetailId + '/' + scope.clientId);
          }
          
          scope.deleteBankDetails = function () {
          //TO DO - Need to handle associated document delete scenario Refere - ViewClientController
            $modal.open({
                templateUrl: 'deleteBankDetail.html',
                controller: DeleteBankDetailCtrl
            });
          };


        var DeleteBankDetailCtrl = function ($scope, $modalInstance) {
            $scope.delete = function () {
                resourceFactory.clientbankDetailsResourceforsave.deletebankdetails({bankdetailsId: routeParams.id},function (data) {
                    $modalInstance.close('delete');
                    location.path('/viewclient/' + scope.clientId);
                });
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };


        }
    });
    mifosX.ng.application.controller('ViewClientBankDetailController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope','ResourceFactory','dateFilter','$modal', mifosX.controllers.ViewClientBankDetailController]).run(function ($log) {
        $log.info("ViewClientBankDetailController initialized");
    });
}(mifosX.controllers || {}));

