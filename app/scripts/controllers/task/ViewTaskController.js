(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTaskController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION,  $rootScope, routeParams) {


            scope.taskData = {};
            scope.formDat = {};
            scope.forceOffice = null;
            scope.tf = "HH:mm";
            scope.formData={};
            scope.taskdetailsData = [{}];
            scope.clientAttendenceData=[{}];
            scope.centerId=routeParams.centerId;
            scope.taskId=routeParams.id;
            scope.officeId=routeParams.officeId;


            var requestParams = {};

            if(routeParams.id){
                requestParams.taskId = routeParams.id;
            }

            resourceFactory.taskResourcesave.get(requestParams,function(data){
                scope.taskData=data;
                scope.clientAttendenceData=data.clientAttendenceData;
                scope.taskdetailsData=data.taskdetailsData;
            });

        }
    })

    mifosX.ng.application.controller('ViewTaskController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$rootScope', '$routeParams', mifosX.controllers.ViewTaskController]).run(function ($log) {
        $log.info("ViewTaskController initialized");
    });
}(mifosX.controllers || {}));
