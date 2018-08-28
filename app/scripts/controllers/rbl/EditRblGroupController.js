(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRblGroupController: function (scope,routeParams, resourceFactory, location, dateFilter) {


            scope.formData = {};
            scope.restrictDate = new Date();
            scope.groupTypeOptions =[{"id":1,"name":"Yes"},{"id":2,"name":"JLG"}];

            resourceFactory.rblgroupresource.get({groupId:routeParams.groupId},function (data) {
                scope.formData=data;
            });
            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblgroupresource.put({groupId:routeParams.groupId},this.formData, function (data) {
                    location.path('/viewgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditRblGroupController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditRblGroupController]).run(function ($log) {
        $log.info("EditRblGroupController initialized");
    });
}(mifosX.controllers || {}));
