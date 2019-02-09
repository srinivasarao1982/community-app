(function (module) {
    mifosX.controllers = _.extend(module, {
        CreditBureauRequestController: function (scope, routeParams, resourceFactory, dateFilter, location) {

            scope.showErrors1=false;
            scope.rblOffice=[];
            scope.showDetails=false;
            scope.staffCenterData=[];

            var requestParams = {orderBy: 'name', sortOrder: 'ASC', staffInSelectedOfficeOnly: true};

            resourceFactory.groupTemplateResource.get(requestParams, function (data) {
                scope.rblOffice = data.officeOptions;
             });

            scope.changeOffice=function(officeId){
                var params = {};
                params.officeId = officeId;
                resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
                    scope.staffCenterData = data;//[0].meetingFallCenters;
                })
            }

            scope.getAllGroupsByCenter =function(centerId) {
                scope.centerId=centerId;
                scope.showDetails=true;
                resourceFactory.centerClientResource.get({centerId: centerId}, function (data) {
                    scope.groups = data.groupMembers;
                })
            }
            scope.checkAll = function(group)
            {
                for(var i =0;i < group.activeClientMembers.length;i++){
                    group.activeClientMembers[i].ischecked = true;
                }
                group.ischecked = true;

            }
            scope.checkIndividual = function (client,group) {
                for (var i = 0; i < group.activeClientMembers.length; i++) {
                    if(group.activeClientMembers[i].id==client.id) {
                        group.activeClientMembers[i].ischecked = true;
                    }
                }
                group.ischecked = true;
            }



            //scope.showPaymentDetailsFn = function () {

            // };


            scope.submit = function () {
                scope.clientId = "";
                scope.groupId ="";
                for (var i = 0; i < scope.groups.length; i++) {
                    if (scope.groups[i].ischecked) {
                        scope.groupId = scope.groupId + "," + scope.groups[i].id;
                        for (var j = 0; j < scope.groups[i].activeClientMembers.length; j++) {
                            if(scope.groups[i].activeClientMembers[j].ischecked) {
                                scope.clientId = scope.clientId + "," + scope.groups[i].activeClientMembers[j].id;
                            }
                        }

                    }

                }
                scope.formData.clintId = scope.clientId;
                resourceFactory.equifaxcreditbureauresource.save({
                    clientId: scope.clientId.substring(1),
                    centerId: scope.centerId
                }, function (data) {
                    location.path('/equifaxcreditbureausearch');
                });
            }
        }
    });
    mifosX.ng.application.controller('CreditBureauRequestController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.CreditBureauRequestController]).run(function ($log) {
        $log.info("CreditBureauRequestController initialized");
    });
}(mifosX.controllers || {}));
