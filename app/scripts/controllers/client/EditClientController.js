(function (module) {
    mifosX.controllers = _.extend(module, {
        EditClientController: function (scope, routeParams, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope) {
            scope.offices = [];
            scope.date = {};
            scope.restrictDate = new Date();
            scope.savingproducts = [];
            scope.clientId = routeParams.id;
            scope.showSavingOptions = 'false';
            scope.opensavingsproduct = 'false';
            scope.addressabove = false;

            scope.addFamilyDetails = function (){
                var family = {};
                scope.formData.familyDetails.push(family);
            };

            scope.deleteFamilyDetails = function (index) {
                scope.formData.familyDetails.splice(index, 1);
            };

            resourceFactory.clientResource.get({clientId: routeParams.id, template:'true', staffInSelectedOfficeOnly:true}, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;

                /*Nirantara Changes*/
                var clientData = data.clientDetailedData;
                //console.log('clientData : ',JSON.stringify(clientData));

                scope.salutations = clientData.salutation;
                scope.martialStatusOptions = clientData.maritalStatus;
                scope.ProfessionOptions = clientData.profession;
                scope.eductionalQualificationOptions = clientData.educationQualification;
                scope.annualIncomeOptions = clientData.annualIncome;
                scope.landHoldings = clientData.landHolding;
                scope.houseTypes = clientData.houseType;
                scope.panForms = clientData.yesOrNo;
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
                scope.identityProofOptions = clientData.identityProof;
                scope.addressProofOptions = clientData.addressProof;
                scope.cfaOccupations = clientData.cfaOccupation;
                console.log("cfaOccupations : ",JSON.stringify(scope.cfaOccupations));
                /*****/
                scope.formData = {
                    officeId: data.officeId,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    middlename: data.middlename,
                    active: data.active,
                    accountNo: data.accountNo,
                    staffId: data.staffId,
                    externalId: data.externalId,
                    mobileNo: data.mobileNo,
                    savingsProductId: data.savingsProductId,
                    genderId: data.gender.id
                };

                if(data.gender){
                    scope.formData.genderId = data.gender.id;
                }

                if(data.clientType){
                    scope.formData.clientTypeId = data.clientType.id;
                }

                if(data.clientClassification){
                    scope.formData.clientClassificationId = data.clientClassification.id;
                }
                if (data.savingsProductId != null) {
                    scope.opensavingsproduct = 'true';
                    scope.showSavingOptions = 'true';
                } else if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = 'true';
                }

                if (data.dateOfBirth) {
                    var dobDate = dateFilter(data.dateOfBirth, scope.df);
                    scope.formData.dateOfBirth = new Date(dobDate);
                }

                var actDate = dateFilter(data.activationDate, scope.df);
                scope.date.activationDate = new Date(actDate);
                if (data.active) {
                    scope.choice = 1;
                    scope.showSavingOptions = 'false';
                    scope.opensavingsproduct = 'false';
                }

                if (data.timeline.submittedOnDate) {
                    var submittedOnDate = dateFilter(data.timeline.submittedOnDate, scope.df);
                    scope.date.submittedOnDate = new Date(submittedOnDate);
                }

                scope.formData.clientExt = {};
                scope.formData.naddress = [{},{}];
                scope.formData.clientIdentifierData = [{},{}];
                scope.formData.familyDetails = [{}];

                scope.formData.clientExt = clientData.clientDataExt;
                scope.formData.naddress = clientData.addressExtData || [];
                if(scope.formData.naddress[1]){
                    var addresObj0 = scope.formData.naddress[0];
                    var addresObj1 = scope.formData.naddress[1];
                    if(JSON.stringify(addresObj0) == JSON.stringify(addresObj1)){
                        scope.addressabove = true;
                    }
                }
                scope.formData.familyDetails = clientData.familyDetailsExtData || [];

                for(var i in scope.formData.familyDetails){
                    if (scope.formData.familyDetails[i].dateOfBirth) {
                        var dateOfBirth = dateFilter(scope.formData.familyDetails[i].dateOfBirth, scope.df);
                        scope.formData.familyDetails[i].dateOfBirth = new Date(dateOfBirth);
                    }
                }

                scope.formData.clientIdentifierData = clientData.clientIdentifierData || [];

                console.log("clientIdentifierData : ",JSON.stringify(scope.formData.clientIdentifierData));

            });

            scope.addressaboveSetting = function(){
                if(scope.addressabove){
                    var idObj2 = "";
                    if(scope.formData.naddress[1] && scope.formData.naddress[1].id){
                        idObj2 = scope.formData.naddress[1].id;
                    }
                    scope.formData.naddress[1] = jQuery.extend(true, {},  scope.formData.naddress[0]);
                    if(!isNaN(idObj2)){
                        scope.formData.naddress[1].id = idObj2;
                    }
                }
            };

            scope.submitAndAccept = function () {
                scope.addressaboveSetting();
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (scope.opensavingsproduct == 'false') {
                    this.formData.savingsProductId = null;
                }
                if (scope.choice === 1) {
                    if (scope.date.activationDate) {
                        this.formData.activationDate = dateFilter(scope.date.activationDate, scope.df);
                    }
                }

                if (scope.formData.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.formData.dateOfBirth, scope.df);
                }

                if(scope.date.submittedOnDate){
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate,  scope.df);
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

                resourceFactory.clientResource.update({'clientId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.EditClientController]).run(function ($log) {
        $log.info("EditClientController initialized");
    });
}(mifosX.controllers || {}));
