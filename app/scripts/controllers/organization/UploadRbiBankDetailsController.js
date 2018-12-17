(function (module) {
    mifosX.controllers = _.extend(module, {
        UploadRbiBankDetailsController: function ($modal,window,scope, location,resourceFactory, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.clientId = routeParams.clientId;
            scope.previewImage = false;
            scope.isBankDetailsUploded = false;
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
                $('#viewer').attr('src',URL.createObjectURL(scope.file));
                scope.previewImage = true;
            };
            scope.submit = function () {
                $upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/rbibankdetails/upload',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        scope.isBankDetailsUploded = true;
                });
            };
        }
    });
    mifosX.ng.application.controller('UploadRbiBankDetailsController', ['$modal','$window','$scope', '$location','ResourceFactory','$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.UploadRbiBankDetailsController]).run(function ($log) {
        $log.info("UploadRbiBankDetailsController initialized");
    });
}(mifosX.controllers || {}));