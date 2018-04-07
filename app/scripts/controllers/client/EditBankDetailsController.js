(function (module) {
    mifosX.controllers = _.extend(module, {
        EditBankDetailsController: function (scope, location, http, routeParams, API_VERSION, $upload, $rootScope, resourceFactory,dateFilter) {
            scope.bankId = routeParams.id;
            scope.formData = {};
            scope.formData1={};
            scope.documenttypes = [];
            scope.clientId = routeParams.clientId;
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
            };
            scope.date1=new Date();
            scope.bankdetails={};
            scope.clientbankdetails={};
            scope.udocumentUpdated=false;
            scope.benificarynamecheck=false;
            scope.accountnocheckcheck=false;
            scope.isDocument=false;

            scope.beneficarynamecheck=function(){
                if(scope.formData.beneficiaryname!=scope.formData.beneficiaryname1){
                    scope.benificarynamecheck=true;
                }

            }
            scope.accountnocheck=function(){
                if(scope.formData.accountnumber!=scope.formData.accountnumber1){
                    scope.accountnocheckcheck=true;
                }
            }

            resourceFactory.clientbankDetailsResource.get({bankId:routeParams.id},function(data){
                scope.formData=data;
                scope.formData.beneficiaryname1=data.beneficiaryname;
                scope.formData.accountnumber1=data.accountnumber;
            });
           // scope.getClientDocuments = function () {
                resourceFactory.clientDocumentsResource.getAllClientDocuments({clientId: routeParams.clientId}, function (data) {
                    for (var l in data) {
                        if(l.name=='Scan copy of passbook'){
                            scope.udocumentUpdated=false;
                        }
                        scope.isDocument=true;
                        var loandocs = {};
                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = loandocs;
                    }
                    scope.clientdocuments = data;
                    /*if(scope.clientdocuments.name!='Scan copy of passbook'){
                        alert("1");
                        alert(scope.clientdocuments.name);

                    }*/

                });
          //  };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.clientDocumentsResource.delete({clientId: routeParams.clientId, documentId: documentId}, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
                scope.udocumentUpdated=true;
            };
            scope.getbankdetails =function(){
                resourceFactory.clientbankDetailsResource.getAll({ifsccode: scope.formData.ifsccode},function(data){
                    if(!angular.isUndefined(data.Bank)) {
                        scope.bankdetails=data;
                    scope.formData.branchname=data.Bank +""+data.Branch;
                    scope.formData.branchaddress=data.Address+ ","+"city:"+data.City+","+"District:-"+data.District+"State:"+data.State
                    }
                    else{
                        scope.ifscoceinvalid=true;
                        scope.formData.branchname="";
                        scope.formData.branchaddress="";
                    }
                });
            }
            scope.formData1.name='Scan copy of passbook';
            //scope.formData.locale = scope.optlang.code;
            //scope.formData.dateFormat = scope.df;
            scope.submit = function () {
                if(scope.benificarynamecheck==true){
                    scope.benificarynamecheck=false;
                }
                if(scope.accountnocheckcheck==true){
                    scope.accountnocheckcheck=false;
                }

                scope.accountnocheck();
                scope.beneficarynamecheck();
                if (!scope.benificarynamecheck && !scope.accountnocheckcheck) {
                    if (scope.udocumentUpdated) {
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
                    }
                    this.formData.lasttransactiondate = dateFilter(scope.date1, scope.df);
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                    resourceFactory.clientbankDetailsResourceforsave.update({bankdetailsId: routeParams.id}, this.formData, function (data) {
                        location.path('/viewclient/' + scope.clientId);
                    });
                }

            }
        }
    });
    mifosX.ng.application.controller('EditBankDetailsController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope','ResourceFactory','dateFilter', mifosX.controllers.EditBankDetailsController]).run(function ($log) {
        $log.info("EditBankDetailsController initialized");
    });
}(mifosX.controllers || {}));

