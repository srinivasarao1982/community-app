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
            var centerIdArray = [];
            scope.submitNextShow = true;
            scope.submitShow = false;
            scope.forcedSubmit = false;
            scope.completedCenter = false;
            scope.officeName = routeParams.officeName;
            scope.meetingDate = routeParams.meetingDate;
            var submittedStaffId = [];
            scope.details = false;
            scope.showPaymentDetails = false;
            scope.showerror=false;
            scope.showErrors1=false;
            scope.rblOffice=[];
            scope.showDetails=false;
            scope.staffCenterData=[];
            scope.groups=[];
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                scope.rblOffice=data.allowedParents;
            });
            scope.changeOffice=function(officeId){
                var params = {};
                params.officeId = officeId;
                resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
                    //if (data[0]) {
                    scope.staffCenterData = data;//[0].meetingFallCenters;
                    /* for (var i = 0; i < scope.staffCenterData.length; i++) {
                         centerIdArray.push({id: scope.staffCenterData[i].id, calendarId: scope.staffCenterData[i].collectionMeetingCalendar.id});
                     }*/
                    // }
                })
            }
            scope.checkAll = function(group)
            {
                for(var i =0;i < group.activeClientMembers.length;i++){
                    group.activeClientMembers[i].ischecked = true;
                }
            }
            scope.getAllGroupsByCenter =function(centerId) {
                scope.showDetails=true;
                resourceFactory.centerClientResource.get({centerId: centerId}, function (data) {
                    scope.groups = data.groupMembers;
                })
            }


            //scope.showPaymentDetailsFn = function () {

            // };

            scope.submit=function() {
                this.batchRequests = [];
                this.formData = {};
                this.formData.clientDetails=[];
                var clientId;
                for(var j=0;j<scope.groups.length;j++){
                    for(var i =0;i < scope.groups[j].activeClientMembers.length;i++){
                        if(scope.groups[j].activeClientMembers[i].ischecked){
                            clientId =clientId+","+scope.groups[j].activeClientMembers[i].id
                            /*  var savingsApplication = {};
                              savingsApplication.clientId = scope.groups[j].activeClientMembers[i].id;
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
  */                            this.batchRequests.push({requestId: i, relativeUrl: "savingsaccounts?command=defaultValues",
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

                    if(scope.response.failed.length === 0 ){
                        location.path('/viewcenter/' + scope.centerId);
                    }

                });

                location.path('/viewcenter/' + scope.centerId);
            };

            scope.cancel = function () {
                if (scope.centerId) {
                    location.path('/viewcenter/' + scope.centerId);
                }
            };


            scope.detailsShow = function() {
                if (scope.details) {
                    scope.details = false;
                } else {
                    scope.details = true;
                }
            }


        }
    });
    mifosX.ng.application.controller('RblFileTransferController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.RblFileTransferController]).run(function ($log) {
        $log.info("RblFileTransferController initialized");
    });
}(mifosX.controllers || {}));
