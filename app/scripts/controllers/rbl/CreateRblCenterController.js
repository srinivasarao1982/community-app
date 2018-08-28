(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblCenterController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.formData = {};
            scope.restrictDate = new Date();
            var requestParams = {staffInSelectedOfficeOnly: true};
            requestParams.officeId = 1;

            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
            });


            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.active = this.formData.active || false;
                resourceFactory.rblcenterresource.save(this.formData, function (data) {
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblCenterController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblCenterController]).run(function ($log) {
        $log.info("CreateRblCenterController initialized");
    });
}(mifosX.controllers || {}));
