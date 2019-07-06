(function (module) {
    mifosX.controllers = _.extend(module, {
        TaskControllerConfiguration: function (scope, resourceFactory, location) {
            scope.taskconfigure = [];
            scope.task={}

            resourceFactory.taskConfigurationResourceforretriveall.get({},function(data){
                scope.taskconfigure=data;

            });
            scope.routeToeditTask =function(id){
                location.path('/viewtaskconfiguration/' + id);
            }

        }

});


    mifosX.ng.application.controller('TaskControllerConfiguration', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.TaskControllerConfiguration]).run(function ($log) {
        $log.info("TaskControllerConfiguration initialized");
    });
}(mifosX.controllers || {}));