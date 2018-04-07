(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientsBankDetailsController: function (scope, location, http, routeParams, API_VERSION, $upload, $rootScope, resourceFactory,dateFilter) {
            scope.clientId = routeParams.clientId;
            scope.formData = {};
            scope.formData1={};
            scope.documenttypes = [];
            scope.clientId = routeParams.clientId;
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
            };
            scope.date1="";//new Date();
            scope.bankdetails={};
            scope.benificarynamecheck=false;
            scope.accountnocheckcheck=false;
            scope.ifscoceinvalid=false;

            scope.accountnocheck=function(){
                if(scope.formData.beneficiaryname!=scope.formData.beneficiaryname1){
                    scope.benificarynamecheck=true;
                }

            }
            scope.beneficarynamecheck=function(){
                if(scope.formData.accountnumber!=scope.formData.accountnumber1){
                    scope.accountnocheckcheck=true;
                }
            }

            scope.getbankdetails =function(){
                resourceFactory.clientbankDetailsResource.getAll({ifsccode: scope.formData.ifsccode},function(data){
                    if(!angular.isUndefined(data.Bank)) {
                        scope.ifscoceinvalid=false;
                        scope.bankdetails = data;
                        scope.formData.branchname = data.Bank + "" + data.Branch;
                        scope.formData.branchaddress = data.Address + "," + "city:" + data.City + "," + "District:-" + data.District + "State:" + data.State
                    }
                    else{
                        scope.ifscoceinvalid=true;
                        scope.formData.branchname="";
                        scope.formData.branchaddress="";
                    }
                    });
                }
            scope.formData1.name='Scan copy of passbook';
            scope.formData.locale = scope.optlang.code;
            scope.formData.dateFormat = scope.df;
            scope.submit = function () {
                if(scope.benificarynamecheck==true){
                    scope.benificarynamecheck=false;
                }
                if(scope.accountnocheckcheck==true){
                    scope.accountnocheckcheck=false;
                }
                scope.accountnocheck();
                scope.beneficarynamecheck();
               // scope.benificarynamecheck = false;
               // scope.accountnocheckcheck = false;
                if (!scope.benificarynamecheck && !scope.accountnocheckcheck) {
                    $upload.upload({
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents',
                        data: scope.formData1,
                        file: scope.file
                    }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                            scope.$apply();
                        }

                    });
                    this.formData.lasttransactiondate = dateFilter(scope.date1, scope.df);
                    this.formData.clientId = routeParams.clientId;
                    resourceFactory.clientbankDetailsResourceforsave.save(this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
                ;
            }
        }
    });
    mifosX.ng.application.controller('ClientsBankDetailsController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope','ResourceFactory','dateFilter', mifosX.controllers.ClientsBankDetailsController]).run(function ($log) {
        $log.info("ClientsBankDetailsController initialized");
    });
}(mifosX.controllers || {}));

