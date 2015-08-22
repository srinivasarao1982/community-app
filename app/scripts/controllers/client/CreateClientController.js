(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {
            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.formData.clientExt = {};
            scope.formData.naddress = [{

            }];
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.clientObject = {};
            scope.formData.familyDetails = [{
                firstname : ''
            }];

            var requestParams = {staffInSelectedOfficeOnly:true};
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {

                // clientObject = clientData; 
                data = clientData.clientBasicDetails;
                scope.salutations = clientData.salutation;
                scope.martialStatusOptions = clientData.maritalStatus;
                scope.ProfessionOptions = clientData.profession;
                scope.eductionalQualificationOptions = clientData.educationQualification;
                scope.annualIncomeOptions = clientData.annualIncome;
                scope.landHoldings = clientData.landHolding;
                scope.houseTypes = clientData.houseType;
                scope.panForms = clientData.yesOrNo;                
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
                scope.identityProofOptions = clientData.identityProof;
                scope.addressProofOptions = clientData.addressProof; 


                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }
                if(routeParams.officeId) {
                    scope.formData.officeId = routeParams.officeId;
                    for(var i in data.officeOptions) {
                        if(data.officeOptions[i].id == routeParams.officeId) {
                            scope.forceOffice = data.officeOptions[i];
                            break;
                        }
                    }
                }
                if(routeParams.groupId) {
                    if(typeof data.staffId !== "undefined") {
                        scope.formData.staffId = data.staffId;
                    }
                }
            });

            scope.changeOffice = function (officeId) {
                resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: officeId
                }, function (data) {
                    var clientBasicDetails = data.clientBasicDetails;
                    scope.staffs = clientBasicDetails.staffOptions;
                    scope.savingproducts = clientBasicDetails.savingProductOptions;
                });
            };

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            if(routeParams.groupId) {
            	scope.cancel = '#/viewgroup/' + routeParams.groupId
            	scope.groupid = routeParams.groupId;
            }else {
            	scope.cancel = "#/clients"
            }

            scope.addressabove = false;
            scope.addressaboveSetting = function(){
                if(!scope.addressabove){
                    scope.formData.naddress[1] = scope.formData.naddress[0];
                }
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

                if (routeParams.groupId) {
                    this.formData.groupId = routeParams.groupId;
                }

                if (routeParams.officeId) {
                    this.formData.officeId = routeParams.officeId;
                }

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                if (scope.formData.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.formData.dateOfBirth, scope.df);
                }

                if (!scope.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }

                for(var i in this.formData.familyDetails){
                    if (this.formData.familyDetails[i].dateOfBirth) {
                        this.formData.familyDetails[i].dateOfBirth = dateFilter(scope.formData.familyDetails[i].dateOfBirth, scope.df);
                    }
                }

                /*Temp Code*/
                this.formData.naddress[0].addressType = this.formData.naddress[0].district;
                this.formData.naddress[1].addressType = this.formData.naddress[1].state;
                /********/


                if(this.formData.naddress){
                    for(var i = 0; i < this.formData.naddress.length; i++){
                        this.formData.naddress[i].locale = scope.optlang.code;
                        this.formData.naddress[i].dateFormat = scope.df;
                    }
                }
                if(this.formData.familyDetails){
                    for(var i = 0; i < this.formData.familyDetails.length; i++){
                        this.formData.familyDetails[i].locale = scope.optlang.code;
                        this.formData.familyDetails[i].dateFormat = scope.df;
                    }
                }

                console.log(JSON.stringify(this.formData));

                resourceFactory.clientResource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
