(function (module) {
    mifosX.controllers = _.extend(module, {
        EditTaskConfigurationController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $rootScope, routeParams) {


            scope.formData = {};
            scope.formDat = {};
            scope.forceOffice = null;
            scope.tf = "HH:mm";
            scope.descriptions=[];
            scope.taskconfigId=routeParams.id;

            var requestParams = {};
            requestParams.taskconfigurationId = routeParams.id;




            requestParams.officeId=1;
            resourceFactory.taskResource.get(requestParams, function (data) {

                scope.taskTypes =data.tasktypeOptions;
                scope.taskStatus=data.taskstatus;
                scope.attendenceTypeOption=data.attendenceTypeOptions;
                scope.staffOptions =data.staffOptions;
            });
            resourceFactory.taskConfigurationResource.get(requestParams, function (data) {
                scope.descriptions =data.descriptions;
                scope.completedBy=data.taskCompletedBy;

            });
            resourceFactory.taskConfigurationResourceforSave.get(requestParams,function(data){
                scope.formData=data;
                scope.formData.completedby=data.completedById;
                if(angular.equals(data.centerType, 'New')){
                    scope.centertypes=true;
                }else{
                    scope.centertypes=false;
                }

            });


            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if(scope.formData.centertype){
                    this.formData.centertype=1;
                }
                else{
                    this.formData.centertype=0;
                }
                resourceFactory.taskConfigurationResourceforUpdate.update({'taskconfigurationId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewtaskconfiguration/' + routeParams.id);
                });

            }


        }
    });

    mifosX.ng.application.controller('EditTaskConfigurationController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$rootScope', '$routeParams',  mifosX.controllers.EditTaskConfigurationController]).run(function ($log) {
        $log.info("EditTaskConfigurationController initialized");
    });
}(mifosX.controllers || {}));
