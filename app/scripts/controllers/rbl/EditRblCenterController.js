(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRblCenterController: function (scope,routeParams, resourceFactory, location, dateFilter) {

            scope.formData = {};
            scope.restrictDate = new Date();
            scope.addedGroups = [];

            var requestParams = {staffInSelectedOfficeOnly: true};
            requestParams.officeId = 1;
            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
            });
            resourceFactory.rblcenterresource.get({centerId:routeParams.centerId}, function (data) {
                scope.formData=data;
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
    mifosX.ng.application.controller('EditRblCenterController', ['$scope','$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditRblCenterController]).run(function ($log) {
        $log.info("EditRblCenterController initialized");
    });
}(mifosX.controllers || {}));
