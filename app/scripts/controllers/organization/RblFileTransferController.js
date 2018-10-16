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
            scope.centerDatas=[];
            scope.groupData=[];
            scope.groups = [];
            scope.selectedcenters=[];
            scope.selectedGroups=[];
            scope.reprocessRequest = false;
            scope.center=[];
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
                resourceFactory.centerResourceRbl.get({centerId: routeParams.id}, function (data) {
                    scope.center = data;
                    scope.selectedcenters.push(data);
                });
                scope.showDetails = true;
                resourceFactory.centerClientResource.get({centerId: centerId}, function (data) {
                    scope.groups = data.groupMembers;
                     for(var j=0;j< scope.groups.length;j++){
                         scope.selectedGroups.push( scope.groups[j]);
                     }
                })

            }
       scope.getClientAfterRemove =function(centerId){
           resourceFactory.centerClientResource.get({centerId: centerId}, function (data) {
               scope.groups = data.groupMembers;
               for(var j=0;j<= scope.groups.length;j++){
                   scope.selectedGroups.push( scope.groups[j]);
               }
           })
       }


            scope.addClient = function () {
                scope.centerIdforFetch=this.formData.id;
                for (var i in this.formData.id) {
                    for (var j in scope.staffCenterData) {
                        if (scope.staffCenterData[j].id == this.formData.id[i]) {
                            var temp = {};
                            temp.id = this.formData.id[i];
                            temp.name = scope.staffCenterData[j].name;
                            temp.externalId = scope.staffCenterData[j].externalId;
                            scope.centerDatas.push(temp);
                            scope.staffCenterData.splice(j, 1);
                        }

                    }
                }
                this.formData.id = this.formData.id - 1;
                scope.getAllGroupsByCenter(scope.centerIdforFetch);
            };

            scope.removeClient = function () {

                for (var i in this.formData.centerids) {
                    for (var j in scope.centerDatas) {
                        if (scope.centerDatas[j].id == this.formData.centerids[i]) {
                            var temp = {};
                            temp.id = this.formData.centerids;
                            temp.name =scope.centerDatas[j].name;
                            temp.externalId = scope.centerDatas[j].externalId;
                            scope.staffCenterData.push(temp);
                            scope.centerDatas.splice(j, 1);
                        }
                    }
                }
                this.formData.centerids = this.formData.centerids - 1;
                scope.selectedGroups=[];
                for(var i=0;i<scope.centerDatas.length;i++){
                    scope.getClientAfterRemove(scope.centerDatas[i].id);
                }
            };

            scope.select = function () {
                scope.selected = false;
                scope.mobileNo = scope.formData.id;
                scope.formData.mobileNo = scope.mobileNo;

            }

            scope.submit = function () {
                scope.clientId ="";
                scope.groupId ="";
                scope.centerId1="";
                for(var i=0;i<scope.centerDatas.length;i++){
                    scope.centerId1=scope.centerId1+"," +scope.centerDatas[i].id;
                }
                for(var k=0;k<scope.selectedGroups.length;k++){
                    if (scope.selectedGroups[k].ischecked) {
                        scope.groupId = scope.groupId + "," + scope.selectedGroups[k].id;
                        for (var j = 0; j < scope.selectedGroups[k].activeClientMembers.length; j++) {
                            scope.clientId = scope.clientId + "," + scope.selectedGroups[k].activeClientMembers[j].id;
                        }
                    }
                }
                scope.formData.clintId = scope.clientId;
                scope.formData.groupId = scope.groupId;
                scope.formData.centerId = scope.centerId1;
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
                    clintId: scope.clientId.substring(1),
                    groupId: scope.groupId.substring(1),
                    centerId:scope.centerId1.substring(1),
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
                scope.clientId ="";
                scope.groupId ="";
                scope.centerId1="";
                for(var i=0;i<scope.centerDatas.length;i++){
                     scope.centerId1=scope.centerId1+"," +scope.centerDatas[i].id;
                }
               for(var k=0;k<scope.selectedGroups.length;k++){
                    if (scope.selectedGroups[k].ischecked) {
                        scope.groupId = scope.groupId + "," + scope.selectedGroups[k].id;
                        for (var j = 0; j < scope.selectedGroups[k].activeClientMembers.length; j++) {
                            scope.clientId = scope.clientId + "," + scope.selectedGroups[k].activeClientMembers[j].id;
                        }
                    }
                }
                scope.formData.clintId = scope.clientId.substring(1);
                scope.formData.groupId = scope.groupId.substring(1);
                scope.formData.centerId = scope.centerId1.substring(1);
                scope.formData.command = 'validate';
                resourceFactory.rblvalidationFilegenerateresource.save({
                    clintId: scope.clientId.substring(1),
                    groupId: scope.groupId.substring(1),
                    centerId: scope.centerId1.substring(1),
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
