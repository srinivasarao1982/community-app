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
                scope.addressTypes = clientData.addressTypes;
                scope.familyrelationShipOptions = clientData.familyrelationShip;
                scope.spouseRelationShip = clientData.coapplicantDetailsData.spouseRelationShip;
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

                scope.formData.coClientData = [{}];

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
                scope.formData.nomineeDetails = [{},{},{}];

                scope.formData.clientExt = clientData.clientDataExt;
                scope.formData.naddress = clientData.addressExtData || [];
                if(scope.formData.naddress == '' || scope.formData.naddress == null || !scope.formData.naddress){
                    scope.formData.naddress = [{},{}];
                }else if(scope.formData.naddress[1]){
                    var addresObj0 = scope.formData.naddress[0];
                    var addresObj1 = scope.formData.naddress[1];
                    if(JSON.stringify(addresObj0) == JSON.stringify(addresObj1)){
                        scope.addressabove = true;
                    }
                }else{
                    scope.formData.naddress.push({});
                }
                scope.formData.familyDetails = clientData.familyDetailsExtData || [];
                if(scope.formData.familyDetails == '' || scope.formData.familyDetails == null || !scope.formData.familyDetails){
                    scope.formData.familyDetails = [{}];
                }else if(scope.formData.familyDetails.length == 0){
                    scope.formData.familyDetails = [{}];
                }

                for(var i in scope.formData.familyDetails){
                    if (scope.formData.familyDetails[i].dateOfBirth) {
                        var dateOfBirth = dateFilter(scope.formData.familyDetails[i].dateOfBirth, scope.df);
                        scope.formData.familyDetails[i].dateOfBirth = new Date(dateOfBirth);
                    }
                }

                scope.formData.clientIdentifierData = clientData.clientIdentifierData || [];
                if(scope.formData.clientIdentifierData == '' || scope.formData.clientIdentifierData == null || !scope.formData.clientIdentifierData){
                    scope.formData.clientIdentifierData = [{},{}];
                }else if(scope.formData.clientIdentifierData.lenght == 0){
                    scope.formData.clientIdentifierData = [{},{}];
                }else if(scope.formData.clientIdentifierData.lenght == 1){
                    scope.formData.clientIdentifierData.push({});
                }

                if(clientData.occupationDetailsData){
                    for(var count in clientData.occupationDetailsData){
                        for(var occCount in scope.cfaOccupations){
                            if(scope.cfaOccupations[occCount].id == clientData.occupationDetailsData[count].occupationTypeId){
                                scope.cfaOccupations[occCount].revenue = clientData.occupationDetailsData[count].annualRevenue;
                                scope.cfaOccupations[occCount].expense = clientData.occupationDetailsData[count].annualExpense;
                                scope.cfaOccupations[occCount].surplus = clientData.occupationDetailsData[count].annualSurplus;
                            }
                        }
                    }
                }

                scope.formData.nomineeDetails = clientData.nomineeDetailsData || [];
                if(scope.formData.nomineeDetails == '' || scope.formData.nomineeDetails == null || !scope.formData.nomineeDetails){
                    scope.formData.nomineeDetails = [{},{}];
                }else if(scope.formData.nomineeDetails.lenght == 0){
                    scope.formData.nomineeDetails = [{},{}];
                }else if(scope.formData.nomineeDetails.lenght == 1){
                    scope.formData.nomineeDetails.push({});
                }

                for(var i in scope.formData.nomineeDetails){
                    if (scope.formData.nomineeDetails[i].dateOfBirth) {
                        var dateOfBirth = dateFilter(scope.formData.nomineeDetails[i].dateOfBirth, scope.df);
                        scope.formData.nomineeDetails[i].dateOfBirth = new Date(dateOfBirth);
                    }
                    if (scope.formData.nomineeDetails[i].guardianDateOfBirth) {
                        var guardianDateOfBirth = dateFilter(scope.formData.nomineeDetails[i].guardianDateOfBirth, scope.df);
                        scope.formData.nomineeDetails[i].guardianDateOfBirth = new Date(guardianDateOfBirth);
                    }
                }
                if(clientData.coapplicantDetailsData.coapplicantData){
                    scope.formData.coClientData = clientData.coapplicantDetailsData.coapplicantData;
                    for(var i in scope.formData.coClientData) {
                        if (scope.formData.coClientData[i].dateOfBirth) {
                            var dateOfBirth = dateFilter(scope.formData.coClientData[i].dateOfBirth, scope.df);
                            scope.formData.coClientData[i].dateOfBirth = new Date(dateOfBirth);
                        }
                    }
                }
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

                if(scope.cfaOccupations){
                    this.formData.cfaOccupations = scope.cfaOccupations;
                    for(var i = 0; i < this.formData.cfaOccupations.length; i++){
                        this.formData.cfaOccupations[i].locale = scope.optlang.code;
                    }
                }

                if(this.formData.nomineeDetails){
                    for(var i = 0; i < this.formData.nomineeDetails.length; i++){
                        this.formData.nomineeDetails[i].locale = scope.optlang.code;
                        this.formData.nomineeDetails[i].dateFormat = scope.df;
                    }
                }

                for(var i in this.formData.nomineeDetails){
                    if (this.formData.nomineeDetails[i].dateOfBirth) {
                        this.formData.nomineeDetails[i].dateOfBirth = dateFilter(scope.formData.nomineeDetails[i].dateOfBirth, scope.df);
                    }
                    if (this.formData.nomineeDetails[i].guardianDateOfBirth) {
                        this.formData.nomineeDetails[i].guardianDateOfBirth = dateFilter(scope.formData.nomineeDetails[i].guardianDateOfBirth, scope.df);
                    }
                }

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

                if(this.formData.naddress.length == 3) {
                    for (var i in scope.addressTypes) {
                        if (scope.addressTypes[i].name == 'Spouse Address') {
                            this.formData.naddress[2].addressType = scope.addressTypes[i].id;
                            break;
                        }
                    }
                }

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
