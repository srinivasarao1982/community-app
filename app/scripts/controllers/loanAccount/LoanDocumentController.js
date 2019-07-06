(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanDocumentController: function (scope, location,resourceFactory, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.loanId = routeParams.loanId;
            scope.clientId = $rootScope.clientId;
            scope.previewImage = false;
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
                $('#viewer').attr('src',URL.createObjectURL(scope.file));
                scope.previewImage = true;
            };

            resourceFactory.clientDocumentTypesCodeValue.getAllClientDocumentTypes({},function (data) {
                scope.documentData = data;
           })

            scope.submit = function () {
                $upload.upload({
                   // url: $rootScope.hostUrl + API_VERSION + '/loans/' + scope.loanId + '/documents',
                   // nextru specific change : loan and clients document storing in same directory 
                    url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        location.path('/viewloanaccount/' + scope.loanId);
                    });
            };
        }
    });
    mifosX.ng.application.controller('LoanDocumentController', ['$scope', '$location', 'ResourceFactory','$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.LoanDocumentController]).run(function ($log) {
        $log.info("LoanDocumentController initialized");
    });
}(mifosX.controllers || {}));