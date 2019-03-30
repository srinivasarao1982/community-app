(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTaskController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $rootScope, routeParams) {


            scope.formData = {};
            scope.formDat = {};
            scope.forceOffice = null;
            scope.tf = "HH:mm";
            scope.formData.taskextradetails = [{}]
            scope.formData.attendencedetails=[{}];
            scope.clients = [];
            scope.selectedClients = [];
            scope.selectedClients1 = [];
            scope.descriptions=[];
            scope.inparams = {resourceType: 'template', templateType: 'jlgbulk', lendingStrategy: 300};
            scope.inparams.centerId=routeParams.centerId;

            var requestParams = {};
            requestParams.taskId = routeParams.id;
            requestParams.officeId=routeParams.officeId;
            requestParams.taskType=routeParams.tasktype;
            scope.mindate=new Date();

            scope.routetoviewtask=function(){
                location.path('/viewtask/' + routeParams.id+"/"+routeParams.centerId+"/"+routeParams.officeId);
            }


            scope.addtaskdescription = function () {
                var description = {};
                scope.formData.taskextradetails.push(description);
            };

            scope.deletedescription = function (index) {
                scope.formData.taskextradetails.splice(index, 1);
            };

            resourceFactory.taskResource.get(requestParams, function (data) {

                scope.taskTypes =data.tasktypeOptions;
                scope.taskStatus=data.taskstatus;
                scope.attendenceTypeOption=data.attendenceTypeOptions;
                scope.staffOptions =data.staffOptions;
                scope.taskStartTimes=data.tasktimeOptions;
                scope.taskEndTimes=data.tasktimeOptions;
            });

            scope.taskTypechange=function(taskTypeId){
                var Param={}
                Param.taskType=taskTypeId;
                Param.officeId=routeParams.officeId;
                resourceFactory.taskResource.get(Param, function (data) {
                    scope.staffOptions =data.staffOptions;
                });
            }

            resourceFactory.taskResourcesave.get(requestParams,function(data){
              //scope.formData=data;
                scope.formData.tasktype=data.taskTypeId;
                scope.formData.staffId=data.staffId;
                scope.formData.attendencedetails=data.clientAttendenceData;
                scope.formData.taskextradetails=data.taskdetailsData;
                scope.formData.taskstatus=data.status.id;
                scope.formData.taskStartTime=data.taskStartTimeId;
                scope.formData.taskEndTime=data.taskEndTimeId;
                if (data.expectedCompletedDate) {
                    var plannedDate = dateFilter(data.expectedCompletedDate, scope.df);
                    scope.formData.plannedDate=new Date(plannedDate);
                }
                if (data.completedDate) {
                    var completedDate = dateFilter(data.completedDate, scope.df);
                    scope.formData.completedDate=new Date(completedDate);
                }

                if((angular.isUndefined(scope.formData.attendencedetails))||(scope.formData.attendencedetails.length==0)){
                   scope.showform=false;
               }else{
                   scope.showform=true;
               }
            });
            resourceFactory.taskConfigurationResource.get(requestParams, function (data) {
                scope.descriptions =data.descriptions;
            });
            requestParams.officeId = 1;

            scope.inparams.productId = 1;
            resourceFactory.loanResource.get(scope.inparams, function (data) {

                scope.groups = data.center.groupMembers;
               // scope.clientId = scope.groups[0].activeClientMembers[0].id;
                scope.clientId=0;
                for (var i in scope.groups) {
                    scope.clients[i] = scope.groups[i].activeClientMembers.map(function (client) {
                       client.attendanceType=1;
                        scope.selectedClients.push(client);
                        scope.selectedClients1.push(client);
                        return client;

                    });
                    scope.groups[i].activeClientMembers = scope.selectedClients1;
                    scope.selectedClients1 = [];
                }

            });

            scope.submit = function () {
               // attendencedetails

                if(!scope.showform) {
                    for (var i in scope.selectedClients) {
                        var details={};
                        details.clientId = scope.selectedClients[i].id;
                        details.attendanceType = scope.selectedClients[i].attendanceType;
                        this.formData.attendencedetails.push(details);
                    }
                }
                else{
                   scope.intermediateattendence= scope.formData.attendencedetails;
                    scope.formData.attendencedetails=[];
                    for(var i in scope.intermediateattendence ){
                        var details={};
                        details.clientId=scope.intermediateattendence[i].clientId;
                        details.attendanceType=scope.intermediateattendence[i].clientAttendence.id;
                        details.isApproved=1;
                        this.formData.attendencedetails.push(details);

                    }
                }
                if (scope.formData.plannedDate) {
                    scope.formData.plannedDate = dateFilter(scope.formData.plannedDate, scope.df);
                    this.formData.plannedDate = scope.formData.plannedDate;
                }
                if (scope.formData.completedDate) {
                    scope.formData.completedDate = dateFilter(scope.formData.completedDate, scope.df);
                    this.formData.completedDate = scope.formData.completedDate;
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.centerId=routeParams.centerId;
                this.formData.feestructureDetails = scope.formData.feestructureDetails
                resourceFactory.taskResourceforupdate.update({'taskId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewtask/' + routeParams.id+"/"+routeParams.centerId+"/"+routeParams.officeId);
                });

            }


        }
    });

    mifosX.ng.application.controller('EditTaskController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$rootScope', '$routeParams',  mifosX.controllers.EditTaskController]).run(function ($log) {
        $log.info("EditTaskController initialized");
    });
}(mifosX.controllers || {}));
