(function (module) {
    mifosX.controllers = _.extend(module, {
        ClientDocumentController: function ($modal,window,scope, location,resourceFactory, http, routeParams, API_VERSION, $upload, $rootScope) {
            scope.clientId = routeParams.clientId;
            scope.previewImage = false;
            scope.onFileSelect = function ($files) {
                scope.file = $files[0];
                $('#viewer').attr('src',URL.createObjectURL(scope.file));
                scope.previewImage = true;
            };
            scope.forceOffice = null;
            //isDisabled used to submit button disabled
            scope.isDisabled = false;
            
            resourceFactory.clientDocumentTypesCodeValue.getAllClientDocumentTypes({},function (data) {
                 scope.documentData = data;
            })

           
            scope.submit = function () {
                scope.isDisabled = true;
                $upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents',
                    data: scope.formData,
                    file: scope.file
                }).then(function (data) {
                        // to fix IE not refreshing the model
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        location.path('/viewclient/' + scope.clientId);
                        
                    }).error(function (data){
                        scope.isDisabled = false;
                    });
            };
        }
    });
    mifosX.ng.application.controller('ClientDocumentController', ['$modal','$window','$scope', '$location','ResourceFactory','$http', '$routeParams', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.ClientDocumentController]).run(function ($log) {
        $log.info("ClientDocumentController initialized");
    });
}(mifosX.controllers || {}));