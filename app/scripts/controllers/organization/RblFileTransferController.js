(function (module) {
    mifosX.controllers = _.extend(module, {
        RblFileTransferController: function (scope, routeParams, resourceFactory, dateFilter, location) {
            var params = {};
            params.locale = scope.optlang.code;
            params.dateFormat = scope.df;
            params.meetingDate = routeParams.meetingDate;
            params.officeId = routeParams.officeId;
            params.staffId = routeParams.staffId;
            if (params.staffId === "undefined") {
                params.staffId = null;
            }
            scope.formData = {};
            scope.rblOffice = [];
            scope.showDetails = false;
            scope.staffCenterData = [];
            scope.groups = [];
            scope.reprocessRequest = false;
            resourceFactory.officeResource.getAllRblOffices({
                officeId: 35,
                rbloffice: true,
                isSequenceNumber: false
            }, function (data) {
                scope.rblOffice = data.allowedParents;
            });
            scope.changeOffice = function (officeId) {
                var params = {};
                params.officeId = officeId;
                resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
                    scope.staffCenterData = data;//[0].meetingFallCenters;
                })
            }
            scope.checkAll = function (group) {
                for (var i = 0; i < group.activeClientMembers.length; i++) {
                    group.activeClientMembers[i].ischecked = true;
                }
                group.ischecked = true;
            }
            scope.reprocessrequest = function () {
                scope.reprocessRequest = true;
            }
            scope.getAllGroupsByCenter = function (centerId) {
                scope.centerId = centerId;
                scope.showDetails = true;
                resourceFactory.centerClientResource.get({centerId: centerId}, function (data) {
                    scope.groups = data.groupMembers;
                })
                resourceFactory.centerResource.get({centerId: routeParams.id}, function (data) {
                    scope.center = data;
                });
            }


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
                scope.formData.groupId = scope.groupId;
                scope.formData.centerId = scope.centerId;
                scope.formData.command = 'nonvalidate';
                if(angular.isUndefined(scope.formData.centerDatatobesent)){
                    scope.centerDatatobesent=false;
                }
                if(angular.isUndefined(scope.formData.groupDatatobesend)){
                    scope.groupDatatobesend=false;
                }
                if(angular.isUndefined(scope.formData.isImagetobesent)){
                    scope.isImagetobesent=false;
                }
                if(angular.isUndefined(scope.formData.isreprocess)){
                    scope.isreprocess=false;
                }

                resourceFactory.rblvalidationFilegenerateresource.save({
                    clintId: scope.clientId,
                    groupId: scope.groupId,
                    centerId: scope.centerId,
                    centerDatatobesent:scope.centerDatatobesent,
                    groupDatatobesend:scope.groupDatatobesend,
                    isImagetobesent:scope.isImagetobesent,
                    isreprocess:scope.isreprocess,
                    command: 'nonvalidate'
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
                scope.formData.groupId = scope.groupId;
                scope.formData.centerId = scope.centerId;
                scope.formData.command = 'validate';
                resourceFactory.rblvalidationFilegenerateresource.save({
                    clintId: scope.clientId,
                    groupId: scope.groupId,
                    centerId: scope.centerId,
                    command: 'validate'
                }, function (data) {
                    location.path('/rblvalidatefilesearch');
                });
            }

        }



    });
    mifosX.ng.application.controller('RblFileTransferController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.RblFileTransferController]).run(function ($log) {
        $log.info("RblFileTransferController initialized");
    });
}(mifosX.controllers || {}));
