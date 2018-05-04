(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewPartialLoanController: function (scope, routeParams,resourceFactory, location) {
            scope.partialLoanDataforreturn = [];
            scope.actualClients = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.centerId=routeParams.centerId;
            scope.routeTo = function () {
                location.path('/viewcenter/' + routeParams.centerId)
            };
                resourceFactory.partialLoanResourceforget.get({
                    parentId:routeParams.centerId
                }, function (data) {
                    scope.partialLoanDataforreturn = data;
                });
        }
    });

    mifosX.ng.application.controller('ViewPartialLoanController', ['$scope', '$routeParams','ResourceFactory', '$location', mifosX.controllers.ViewPartialLoanController]).run(function ($log) {
        $log.info("ViewPartialLoanController initialized");
    });
}(mifosX.controllers || {}));