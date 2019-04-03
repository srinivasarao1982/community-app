(function (module) {
    mifosX.controllers = _.extend(module, {
        JlgSavingsAccountController: function (scope, resourceFactory, location, routeParams, dateFilter, $rootScope) {
            scope.response = {success:[],failed:[]};
            scope.centerId = routeParams.centerId;
            scope.officeId = $rootScope.officeId;
            scope.officeName = $rootScope.officeName;
            scope.centerName = $rootScope.centerName;
            scope.date = {};
            scope.inparams = {};
            scope.selectedClients=[];
            scope.selectedClients1=[];
            scope.rblOffice=[];
            scope.clients=[];
            scope.date.submittedOnDate = new Date();
            if (scope.centerId) {
                scope.inparams.centerId = scope.centerId

            }


            ;
            resourceFactory.centerClientResource.get({centerId: scope.centerId}, function (data) {
                scope.groups=data.groupMembers;
            });
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                scope.rblOffice=data.allowedParents;
            });
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:false,isSequenceNumber:true,entityId:5},function(data){
                scope.sequenceNumber=data.sequenceNo;
            });
            scope.inparams.staffInSelectedOfficeOnly = true;

            resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
            });

            scope.changeProduct=function(productid){
                resourceFactory.savingsTemplateResource.get({groupId: scope.centerId,productId:productid,staffInSelectedOfficeOnly:'true'},function (data) {
                    scope.fieldOfficers = data.fieldOfficerOptions;
                });
               /* for(var i=0;i<scope.rblOffice.length;i++){
                    alert(scope.rblOffice[i].id);
                    alert(scope.clientofficeId);
                    if(scope.rblOffice[i].id==scope.clientofficeId){
                        scope.formData.externalId=scope.sequenceNumber;
                        break;
                    }
                }*/
                var p=1;

                for( var i =0; i<=scope.groups.length;i++ ) {

                    scope.clients[i] = scope.groups[i].activeClientMembers.map(function (client) {
                        if(p==1){
                            client.extId=scope.sequenceNumber;
                        }
                        else{
                            scope.sequenceNumber=scope.sequenceNumber+1;
                            client.extId=scope.sequenceNumber;
                        }
                        p=p+1;
                        scope.selectedClients.push(client);
                        scope.selectedClients1.push(client);
                        return client;

                        scope.groups[i].activeClientMembers=scope.selectedClients1;
                        scope.selectedClients1 =[];
                    });
                }

            }

            scope.checkAll = function(group)
            {
                for(var i =0;i < group.activeClientMembers.length;i++){
                    group.activeClientMembers[i].ischecked = true;
                }
            }

            scope.submit=function() {
                this.batchRequests = [];
                this.formData = {};
                this.formData.clientDetails=[];
                for(var j=0;j<scope.groups.length;j++){
                    for(var i =0;i < scope.groups[j].activeClientMembers.length;i++){
                      if(scope.groups[j].activeClientMembers[i].ischecked){

                        var savingsApplication = {};
                        savingsApplication.clientId = scope.groups[j].activeClientMembers[i].id;
                          savingsApplication.externalId=scope.groups[j].activeClientMembers[i].extId;
                        savingsApplication.date= dateFilter(scope.date.submittedOnDate, scope.df);
                        if(scope.isactivate){
                            savingsApplication.active=true;
                        }else{
                            savingsApplication.active=false;
                        }
                          savingsApplication.fieldOfficerId=scope.fieldOfficer;
                        savingsApplication.locale = scope.optlang.code;
                        savingsApplication.dateFormat =  scope.df;
                        savingsApplication.productId=scope.productId;
                        this.batchRequests.push({requestId: i, relativeUrl: "savingsaccounts?command=defaultValues",
                            method: "POST", body: JSON.stringify(savingsApplication)});
                    }

                }
            }
                resourceFactory.batchResource.post(this.batchRequests, function (data) {

                    for (var i = 0; i < data.length; i++) {
                        if(data[i].statusCode == 200 )
                            scope.response.success.push(data[i]);
                        else
                            scope.response.failed.push(data[i]);
                    }
                    location.path('/viewcenter/' + scope.centerId);

                });

            };

            scope.cancel = function () {
                if (scope.centerId) {
                    location.path('/viewcenter/' + scope.centerId);
                }
            };


        }


    });
            mifosX.ng.application.controller('JlgSavingsAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter','$rootScope', mifosX.controllers.JlgSavingsAccountController]).run(function ($log) {
                $log.info("JlgSavingsAccountController initialized");
            });
        }(mifosX.controllers || {}));