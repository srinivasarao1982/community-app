(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCoClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {

            scope.clientId = routeParams.id;
            scope.formData = {};
            scope.formData.clientId = routeParams.id;
            scope.formData.coClientData = [{}];

            scope.formData.naddress = [{}];

            resourceFactory.coClientTemplateResource.get({}, function (coClientData) {
                scope.spouseRelationShip = coClientData.spouseRelationShip;
                scope.districtOptins = coClientData.district;
                scope.stateOptions = coClientData.state;
                scope.addressTypes = coClientData.addressTypes;
            });

            scope.issave = false;
            scope.submitAndAccept = function () {
                scope.issave = true;
                if(this.formData.coClientData){
                    for(var i = 0; i < this.formData.coClientData.length; i++){
                        if(this.formData.coClientData[i].relationship){
                            this.formData.coClientData[i].clientId = scope.formData.clientId;
                            if (scope.formData.coClientData[i].dateOfBirth) {
                                this.formData.coClientData[i].dateOfBirth = dateFilter(scope.formData.coClientData[i].dateOfBirth, scope.df);
                            }
                            this.formData.coClientData[i].locale = scope.optlang.code;
                            this.formData.coClientData[i].dateFormat = scope.df;
                        }
                    }
                }

                if(this.formData.naddress){
                    for(var i in scope.addressTypes){
                        if(scope.addressTypes[i].name == 'Spouse Address'){
                            this.formData.naddress[0].addressType = scope.addressTypes[i].id;
                            break;
                        }
                    }
                    for(var i = 0; i < this.formData.naddress.length; i++){
                        this.formData.naddress[i].locale = scope.optlang.code;
                        this.formData.naddress[i].dateFormat = scope.df;
                    }
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                resourceFactory.coClientResource.save(this.formData, function (data) {
                    scope.issave = false;
                    location.path('/viewclient/' + scope.formData.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCoClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateCoClientController]).run(function ($log) {
        $log.info("CreateCoClientController initialized");
    });
}(mifosX.controllers || {}));