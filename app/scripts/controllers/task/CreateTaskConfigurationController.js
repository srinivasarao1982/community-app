(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTaskConfigurationController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $rootScope, routeParams) {

            scope.taskTypes = [];
            scope.staffOptions = [];
            scope.descriptions = [];
            scope.completedBy = [];
            scope.taskStatus = [];
            scope.attendenceTypeOption = [];
            scope.formDat = {};
            scope.forceOffice = null;
            scope.tf = "HH:mm";
            scope.formData = {};
            scope.centerId = routeParams.id;


            var requestParams = {staffInSelectedOfficeOnly: true};
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            requestParams.officeId = 1;
            resourceFactory.taskResource.get(requestParams, function (data) {

                scope.taskTypes = data.tasktypeOptions;
                scope.taskStatus = data.taskstatus;
                scope.attendenceTypeOption = data.attendenceTypeOptions;
                scope.staffOptions = data.staffOptions;
            });
            resourceFactory.taskConfigurationResource.get(requestParams, function (data) {
                scope.descriptions = data.descriptions;
                scope.completedBy = data.taskCompletedBy;
            });

            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (scope.formData.centertype) {
                    this.formData.centertype = 1;

                }
                else {
                    this.formData.centertype = 0;
                }
                //   this.formData.feeDetails = scope.formData.feeDetails
                resourceFactory.taskConfigurationResourceforSave.save(this.formData, function (data) {
                    location.path('/viewtaskconfiguration/' + data.resourceId);
                });

            }
        }

    })

    mifosX.ng.application.controller('CreateTaskConfigurationController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION',  '$rootScope', '$routeParams',  mifosX.controllers.CreateTaskConfigurationController]).run(function ($log) {
        $log.info("CreateTaskConfigurationController initialized");
    });
}(mifosX.controllers || {}));
