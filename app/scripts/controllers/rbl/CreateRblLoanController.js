(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblLoanController: function (scope, resourceFactory, location, dateFilter) {

            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.addedGroups = [];
            scope.pslcodeOptions =[{"id":1,"name":103},{"id":2,"name":104},{"id":3,"name":107},{"id":4,"name":108},{"id":5,"name":114},{"id":6,"name":125}];
            scope.topuploanflagOptions=[{"id":1,"name":"Normal Loan"},{"id":2,"name":"Top UpLoan"}];


            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblgroupresource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblLoanController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblLoanController]).run(function ($log) {
        $log.info("CreateRblLoanController initialized");
    });
}(mifosX.controllers || {}));
