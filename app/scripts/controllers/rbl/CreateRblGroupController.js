(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblGroupController: function (scope, resourceFactory, location, dateFilter) {

            //scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.groupTypeOptions =[{"id":1,"name":"Yes"},{"id":2,"name":"JLG"}];

            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblgroupresource.save(this.formData, function (data) {
                    location.path('/viewgroup/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblGroupController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblGroupController]).run(function ($log) {
        $log.info("CreateRblGroupController initialized");
    });
}(mifosX.controllers || {}));
