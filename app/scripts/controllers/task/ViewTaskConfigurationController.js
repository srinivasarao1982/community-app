(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewTaskConfigurationController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION,  $rootScope, routeParams) {


            scope.taskData = {};
            scope.formDat = {};
            scope.forceOffice = null;
            scope.tf = "HH:mm";
            scope.formData={};
            var requestParams = {};
            if(routeParams.id){
                requestParams.taskconfigurationId = routeParams.id;
            }

            resourceFactory.taskConfigurationResourceforSave.get(requestParams,function(data){
                scope.taskData=data;

            });

        }
    })

    mifosX.ng.application.controller('ViewTaskConfigurationController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$rootScope', '$routeParams', mifosX.controllers.ViewTaskConfigurationController]).run(function ($log) {
        $log.info("ViewTaskConfigurationController initialized");
    });
}(mifosX.controllers || {}));
