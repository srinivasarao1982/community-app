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
                alert("1");
                scope.showDetails = true;
                resourceFactory.centerClientResource.get({centerId: centerId}, function (data) {
                    alert("2");
                    scope.groups = data.groupMembers;
                    alert("3");

                    scope.selectedGroups.push( data.groupMembers);
                    alert("4");
                })
                resourceFactory.centerResource.get({centerId: routeParams.id}, function (data) {
                    scope.center = data;
                    alert("5");
                    scope.selectedcenters.push(data);
                    alert("6");
                });
            }

//===
            scope.addClient = function () {
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
                scope.getAllGroupsByCenter(this.formData.id);
            };

            scope.removeClient = function () {

                for (var i in this.formData.client) {
                    for (var j in scope.client) {
                        if (scope.client[j].id == this.formData.client[i]) {

                            var temp = {};
                            temp.id = this.formData.client[i];
                            temp.displayName = scope.client[j].displayName;
                            temp.mobileNo = scope.client[j].mobileNo;
                            temp.externalId = scope.client[j].externalId;
                            scope.clients.push(temp);
                            scope.client.splice(j, 1);
                        }
                    }
                }
                this.formData.client = this.formData.client - 1;
            };

            scope.select = function () {
                scope.selected = false;
                scope.mobileNo = scope.formData.id;
                scope.formData.mobileNo = scope.mobileNo;

            }

            scope.selectAll = function () {
                scope.selected = false;
                //reduce the size of clients by 1;
                this.formData.clients =this.formData.clients-1;
                for (var l in scope.clients) {

                    var temp = {};
                    temp.id = scope.clients[l].id;
                    temp.displayName = scope.clients[l].displayName;
                    temp.mobileNo = scope.clients[l].mobileNo;
                    temp.externalId = scope.clients[l].externalId;
                    scope.client.push(temp);
                }
                //scope.client= scope.mobileNo;
                scope.clients = [];

            }

            scope.clear = function () {
                for (var l in scope.client) {
                    var temp = {};
                    temp.id = scope.client[l].id;
                    temp.displayName = scope.client[l].displayName;
                    temp.mobileNo = scope.client[l].mobileNo;
                    temp.externalId = scope.client[l].externalId;
                    scope.clients.push(temp);
                }
                scope.client = [];
                scope.selected = false;
                scope.formData.mobileNo = " ";
                scope.formData.id = "";
                //reduce the size of selected client Array
                this.formData.client=this.formData.client-1;

                //scope.clients=scope.formData.client;
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
