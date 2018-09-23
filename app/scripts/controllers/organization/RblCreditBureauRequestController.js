(function (module) {
    mifosX.controllers = _.extend(module, {
        RblCreditBureauRequestController: function (scope, routeParams, resourceFactory, dateFilter, location) {

            scope.showErrors1=false;
            scope.rblOffice=[];
            scope.showDetails=false;
            scope.staffCenterData=[];
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                scope.rblOffice=data.allowedParents;
            });
            scope.changeOffice=function(officeId){
                var params = {};
                params.officeId = officeId;
                resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
                        scope.staffCenterData = data;//[0].meetingFallCenters;
                })
            }

            scope.getAllGroupsByCenter =function(centerId) {
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



            //scope.showPaymentDetailsFn = function () {

            // };


            scope.submit = function () {
                scope.clientId = 0;
                scope.groupId = 0;
                for (var i = 0; i < scope.groups.length; i++) {
                    if (scope.groups[i].ischecked) {
                        scope.groupId = scope.groupId + "," + scope.groups[i].id;
                        for (var j = 0; j < scope.groups[i].activeClientMembers.length; j++) {
                            scope.clientId = scope.clientId + "," + scope.groups[i].activeClientMembers[j].id;
                        }

                    }

                }
                scope.formData.clintId = scope.clientId;
                resourceFactory.rblvalidationcreditbureauresource.save({
                    clintId: scope.clientId,
                    isValidate:false,
                }, function (data) {
                    location.path('/rblfilesearch');
                });
            }
            scope.validate = function () {
                scope.clientId = 0;
                scope.groupId = 0;
                for (var i = 0; i < scope.groups.length; i++) {
                    if (scope.groups[i].ischecked) {
                        scope.groupId = scope.groupId + "," + scope.groups[i].id;
                        for (var j = 0; j < scope.groups[i].activeClientMembers.length; j++) {
                            scope.clientId = scope.clientId + "," + scope.groups[i].activeClientMembers[j].id;
                        }

                    }

                }
                scope.formData.clintId = scope.clientId;
                resourceFactory.rblvalidationcreditbureauresource.save({
                    clintId: scope.clientId,
                    isValidate:true,
                }, function (data) {
                    location.path('/rblvalidatefilesearch');
                });
            }



        }
    });
    mifosX.ng.application.controller('RblCreditBureauRequestController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.RblCreditBureauRequestController]).run(function ($log) {
        $log.info("RblCreditBureauRequestController initialized");
    });
}(mifosX.controllers || {}));
