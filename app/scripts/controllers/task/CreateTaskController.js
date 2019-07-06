(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTaskController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $rootScope, routeParams ) {

            scope.taskTypes = [];
            scope.staffOptions = [];
            scope.descriptions = [];
            scope.taskStatus= [];
            scope.attendenceTypeOption=[];
            scope.formDat = {};
            scope.forceOffice = null;
            scope.tf = "HH:mm";
            scope.formData={};
           scope.formData.taskextradetails = [];
           scope.centerId=routeParams.id;
            scope.taskStartTimes=[];
            scope.taskEndTimes=[];
            scope.mindate=new Date();



            var requestParams = {staffInSelectedOfficeOnly:true};
         //   requestParams.taskType=1;
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
           // requestParams.officeId=1;
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
            resourceFactory.taskConfigurationResource.get(requestParams, function (data) {

                scope.descriptions =data.descriptions;

            });

            scope.addtaskdescription = function () {
                var description = {};
                scope.formData.taskextradetails.push(description);
            };

            scope.deletedescription = function (index) {
                scope.formData.taskextradetails.splice(index, 1);
            };


            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.centerId=routeParams.id;
                this.formData.officeId=routeParams.officeId;
                if (scope.formData.plannedDate) {
                    scope.formData.plannedDate = dateFilter(scope.formData.plannedDate, scope.df);
                    this.formData.plannedDate = scope.formData.plannedDate;
                }
                resourceFactory.taskResourcesave.save(this.formData, function (data) {
                    location.path('/viewcenter/' + routeParams.id);
                });

            }
        }
    })

    mifosX.ng.application.controller('CreateTaskController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION',  '$rootScope', '$routeParams',  mifosX.controllers.CreateTaskController]).run(function ($log) {
        $log.info("CreateTaskController initialized");
    });
}(mifosX.controllers || {}));