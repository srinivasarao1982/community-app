(function (module) {
    mifosX.controllers = _.extend(module, {
        EditClientController: function (scope, routeParams, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope) {

            /*********************************/
            scope.isOfficeIdRequired = true; // Capture Office
            scope.isStaffIdRequired = true; // Capture Staff
            scope.isSalutationRequired = true; // Title
            scope.isFirstnameRequired = true; // Applicant First Name
            scope.isMiddlenameRequired = false; // Applicant Middle Name
            scope.isLastnameRequired = false; // Applicant Last Name

            scope.isSPFirstnameRequired = true; // Applicant Father/Spouse First Name
            scope.isSPMiddlenameRequired = false; // Applicant Father/Spouse Middle Name
            scope.isSPLastnameRequired = false; // Applicant Father/Spouse Last Name

            scope.isGenderRequired = true; // Applicant Gender
            scope.isMaritalStatusRequired = true; //Applicant Marital Status
            scope.isDateOfBirthApplicantRequired = true; //Applicant DateOfBirth
            scope.isEducationalQualificationClientRequired = false; //Applicant Educational Qualification
            scope.isProfessionClientRequired = false; //Applicant Profession
            scope.isAnnualIncomeRequired = false; //Applicant Annual Income
            scope.isLandHoldingRequired = false; //Applicant Land Holding
            scope.isHouseTypeRequired = false; //Applicant House Type
            scope.isAadhaarNoRequired = true; //Applicant aadhaarNo
            scope.isPanNoRequired = false; //Applicant Pan No
            scope.isPanFormRequired = false; //Applicant Pan Form
            scope.isNregaNoRequired = false; //Applicant NREGA Number
            scope.isNregaNoRequired = false; //Applicant NREGA Number
            scope.isClientTypeRequired = false; //Applicant Belonging to
            scope.isClientReligionRequired = false; //Applicant Belonging to


            scope.isHouseNumberRequired = false;
            scope.isStreetNumberRequired = false;
            scope.isAreaLocalityRequired = false;
            scope.isLandMarkRequired = false;
            scope.isVillageTownRequired = false;
            scope.isTalukaRequired = false;
            scope.isDistrictRequired = true;
            scope.isStateRequired = true;
            scope.isPinCodeRequired = true;
            scope.isLandlineNumberRequired = true;
            scope.isMobileNumberRequired = true;

            scope.isIdentityProofRequired = false;
            scope.isIdentityProofNumberRequired = false;
            scope.isAddressProofRequired = false;
            scope.isAddressProofNumberRequired = false;

            scope.isFamilyFirstNameRequired = false;
            scope.isFamilyRelationshipRequired = false;
            scope.isFamilyGenderRequired = false;
            scope.isFamilyAgeRequired = false;
            scope.isFamilyDateOfBirthRequired = false;
            scope.isFamilyOccupationRequired = false;
            scope.isFamilyEducationalStatusRequired = false;


            scope.isNomineeTitleRequired = false;
            scope.isNomineeNameRequired = false;
            scope.isNomineeGenderRequired = false;
            scope.isNomineeAgeRequired = false;
            scope.isNomineeRelationshipBorrowerRequired = false;
            scope.isNomineeDOBRequired = false;
            scope.isNomineeGuardianAddressRequired = false;


            /********************************/

            scope.formData = {};
            scope.offices = [];
            scope.date = {};
            scope.restrictDate = new Date();
            scope.savingproducts = [];
            scope.clientId = routeParams.id;
            scope.cancel = function () {
                if (scope.clientId) {
                    location.path('/viewclient/' + scope.clientId);
                }
            };
            scope.cancel = '/viewclient/' + scope.clientId;
            scope.showSavingOptions = 'false';
            scope.opensavingsproduct = 'false';
            scope.addressabove = false;

            scope.addFamilyDetails = function () {
                var family = {};
                scope.formData.familyDetails.push(family);
            };

            scope.deleteFamilyDetails = function (index) {
                scope.formData.familyDetails.splice(index, 1);
            };

            resourceFactory.clientResource.get({
                clientId: routeParams.id,
                template: 'true',
                staffInSelectedOfficeOnly: true
            }, function (data) {
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

                scope.identityProofOptions = [];
                scope.coidentityProofOptions = [];

                scope.addressProofOptions = [];
                scope.coaddressProofOptions = [];

                var identityProof = clientData.identityProof;
                for (var i in identityProof) {
                    if (identityProof[i].name && identityProof[i].name.indexOf('Coapplicant-') > -1) {
                        scope.coidentityProofOptions.push(identityProof[i]);
                    } else {
                        scope.identityProofOptions.push(identityProof[i]);
                    }
                }

                var addressProof = clientData.addressProof;
                for (var i in addressProof) {
                    if (addressProof[i].name && addressProof[i].name.indexOf('Coapplicant-') > -1) {
                        scope.coaddressProofOptions.push(addressProof[i]);
                    } else {
                        scope.addressProofOptions.push(addressProof[i]);
                    }
                }

                scope.cfaOccupations = clientData.cfaOccupation;
                scope.addressTypes = clientData.addressTypes;
                scope.familyrelationShipOptions = clientData.familyrelationShip;
                scope.spouseRelationShips = clientData.spouseRelationShip;
                scope.spouseRelationShip = clientData.coapplicantDetailsData.spouseRelationShip;
                //scope.sourceOfLoans = clientData.presentLoanSourceTypes;
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
                    genderId: data.gender.id,

                };

                if (data.activationDate) {
                    var actDate = dateFilter(data.activationDate, scope.df);
                    scope.formData.activationDate = new Date(actDate);
                }
                if (data.timeline) {
                    var submittedOnDate = dateFilter(data.timeline.submittedOnDate, scope.df);
                    scope.date.submittedOnDate = new Date(submittedOnDate);
                }


                if (data.gender) {
                    scope.formData.genderId = data.gender.id;
                }

                if (data.clientType) {
                    scope.formData.clientTypeId = data.clientType.id;
                }

                if (data.clientClassification) {
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
                    scope.formData.submittedOnDate = new Date(submittedOnDate);
                }

                scope.formData.clientExt = {};
                scope.formData.naddress = [{}, {}, {}];

                scope.formData.clientIdentifierData = [{}, {}, {}, {}];
                scope.formData.familyDetails = [{}];
                scope.formData.nomineeDetails = [{}, {}, {}];

                scope.formData.clientExt = clientData.clientDataExt;

                if (clientData.addressExtData && clientData.addressExtData.length > 0) {
                    for (var i in clientData.addressExtData) {
                        if (clientData.addressExtData[i].addressTypeLable == "Comuniation Address") {
                            scope.formData.naddress[0] = clientData.addressExtData[i];
                        } else if (clientData.addressExtData[i].addressTypeLable == "KYC address") {
                            scope.formData.naddress[1] = clientData.addressExtData[i];
                        } else if (clientData.addressExtData[i].addressTypeLable == "Spouse Address") {
                            scope.formData.naddress[2] = clientData.addressExtData[i];
                        }
                    }
                }

                for (var i = 0; i < scope.formData.naddress.length; i++) {
                    if (!scope.formData.naddress[i].state && scope.stateOptions[0] && scope.stateOptions[0].id) {
                        scope.formData.naddress[i].state = scope.stateOptions[0].id;
                    }
                }
                
                //console.log(JSON.stringify(scope.formData.naddress));

                //modify

                scope.formData.familyDetails = clientData.familyDetailsExtData || [];
                if (scope.formData.familyDetails == '' || scope.formData.familyDetails == null || !scope.formData.familyDetails) {
                    scope.formData.familyDetails = [{}];
                } else if (scope.formData.familyDetails.length == 0) {
                    scope.formData.familyDetails = [{}];
                }


                for (var i in scope.formData.familyDetails) {
                    if (scope.formData.familyDetails[i].dateOfBirth) {
                        scope.formData.familyDetails[i].dateOfBirth = dateFilter(new Date(scope.formData.familyDetails[i].dateOfBirth), scope.df);
                    }
                }

                if (clientData.clientIdentifierData && clientData.clientIdentifierData.length > 0) {
                    for (var i in clientData.clientIdentifierData) {
                        if (clientData.clientIdentifierData[i].documentTypeLabel.indexOf('Coapplicant-') < 0) {
                            for (var j in scope.identityProofOptions) {
                                if (scope.identityProofOptions[j].id == clientData.clientIdentifierData[i].documentTypeId) {
                                    scope.formData.clientIdentifierData[0] = clientData.clientIdentifierData[i];
                                    break;
                                }
                            }
                        } else {
                            for (var j in scope.coidentityProofOptions) {
                                if (scope.coidentityProofOptions[j].id == clientData.clientIdentifierData[i].documentTypeId) {
                                    scope.formData.clientIdentifierData[2] = clientData.clientIdentifierData[i];
                                    break;
                                }
                            }
                        }
                    }
                }

                if (clientData.clientIdentifierData && clientData.clientIdentifierData.length > 0) {
                    for (var i in clientData.clientIdentifierData) {
                        if (clientData.clientIdentifierData[i].documentTypeLabel.indexOf('Coapplicant-') < 0) {
                            for (var j in scope.addressProofOptions) {
                                if (scope.addressProofOptions[j].id == clientData.clientIdentifierData[i].documentTypeId) {
                                    scope.formData.clientIdentifierData[1] = clientData.clientIdentifierData[i];
                                    break;
                                }
                            }
                        } else {
                            for (var j in scope.coaddressProofOptions) {
                                if (scope.coaddressProofOptions[j].id == clientData.clientIdentifierData[i].documentTypeId) {
                                    scope.formData.clientIdentifierData[3] = clientData.clientIdentifierData[i];
                                    break;
                                }
                            }
                        }
                    }
                }

                //console.log(JSON.stringify(scope.formData.clientIdentifierData));

                if (clientData.occupationDetailsData) {
                    scope.totalRevenue = 0;
                    scope.totalExpense = 0;
                    scope.totalSurplus = 0;
                    for (var count in clientData.occupationDetailsData) {
                        for (var occCount in scope.cfaOccupations) {
                            if (scope.cfaOccupations[occCount].id == clientData.occupationDetailsData[count].occupationTypeId) {
                                scope.cfaOccupations[occCount].revenue = clientData.occupationDetailsData[count].annualRevenue;
                                scope.cfaOccupations[occCount].expense = clientData.occupationDetailsData[count].annualExpense;
                                scope.cfaOccupations[occCount].surplus = clientData.occupationDetailsData[count].annualSurplus;
                                if (scope.cfaOccupations[occCount].revenue != null && scope.cfaOccupations[occCount].revenue != "" && scope.cfaOccupations[occCount].expense != null && scope.cfaOccupations[occCount].expense != "") {
                                    if (parseInt(scope.cfaOccupations[occCount].expense) > parseInt(scope.cfaOccupations[occCount].revenue)) {
                                        scope.cfaOccupations[occCount].surplus = (scope.cfaOccupations[occCount].revenue - scope.cfaOccupations[occCount].expense);
                                        scope.totalRevenue = parseInt(scope.totalRevenue) + parseInt(scope.cfaOccupations[occCount].revenue);
                                        scope.totalExpense = parseInt(scope.totalExpense) + parseInt(scope.cfaOccupations[occCount].expense);
                                        scope.totalSurplus = scope.totalSurplus + scope.cfaOccupations[occCount].surplus;
                                    }
                                    else {
                                        scope.cfaOccupations[occCount].surplus = (scope.cfaOccupations[occCount].revenue - scope.cfaOccupations[occCount].expense);
                                        scope.totalRevenue = parseInt(scope.totalRevenue) + parseInt(scope.cfaOccupations[occCount].revenue);
                                        scope.totalExpense = parseInt(scope.totalExpense) + parseInt(scope.cfaOccupations[occCount].expense);
                                        scope.totalSurplus = scope.totalSurplus + scope.cfaOccupations[occCount].surplus;
                                    }
                                }
                            }
                        }
                    }
                }

                scope.formData.nomineeDetails = clientData.nomineeDetailsData || [];
                if (scope.formData.nomineeDetails == '' || scope.formData.nomineeDetails == null || !scope.formData.nomineeDetails) {
                    scope.formData.nomineeDetails = [{}, {}];
                } else if (scope.formData.nomineeDetails.lenght == 0) {
                    scope.formData.nomineeDetails = [{}, {}];
                } else if (scope.formData.nomineeDetails.lenght == 1) {
                    scope.formData.nomineeDetails.push({});
                }

                for (var i in scope.formData.nomineeDetails) {
                    if (scope.formData.nomineeDetails[i].dateOfBirth) {
                        var dateOfBirth = dateFilter(scope.formData.nomineeDetails[i].dateOfBirth, scope.df);
                        scope.formData.nomineeDetails[i].dateOfBirth = new Date(dateOfBirth);
                    }
                    if (scope.formData.nomineeDetails[i].guardianDateOfBirth) {
                        var guardianDateOfBirth = dateFilter(scope.formData.nomineeDetails[i].guardianDateOfBirth, scope.df);
                        scope.formData.nomineeDetails[i].guardianDateOfBirth = new Date(guardianDateOfBirth);
                    }
                }

                scope.formData.coClientData = [{}];

                if (clientData.coapplicantDetailsData.coapplicantData) {
                    scope.formData.coClientData = clientData.coapplicantDetailsData.coapplicantData;
                    if (scope.formData.coClientData.length > 0) {
                        for (var i in scope.formData.coClientData) {
                            if (scope.formData.coClientData[i].dateOfBirth) {
                                var dateOfBirth = dateFilter(scope.formData.coClientData[i].dateOfBirth, scope.df);
                                scope.formData.coClientData[i].dateOfBirth = new Date(dateOfBirth);
                            }
                        }
                    }
                    else {
                        scope.formData.coClientData.push({})
                    }
                }
            });


            scope.$watch('formData.nomineeDetails[0].dateOfBirth', function () {
                scope.AgeCalculate(0);
            });
            scope.$watch('formData.nomineeDetails[1].dateOfBirth', function () {
                scope.AgeCalculate(1);
            });
            scope.$watch('formData.coClientData[0].dateOfBirth', function () {
                scope.AgeCalculate(2);
            });

            scope.$watch('autofillHolder', function () {

                if (scope.autofillHolder != '' && scope.autofillHolder != null) {
                    scope.selected = true;
                }
            });

            scope.AgeCalculate = function (a) {

                scope.birthDate = [];
                scope.todayDates = [];
                if (a == 0 && scope.formData.nomineeDetails && scope.formData.nomineeDetails[0] && scope.formData.nomineeDetails[0].dateOfBirth) {
                    scope.date = dateFilter(new Date(scope.formData.nomineeDetails[0].dateOfBirth), 'dd-MM-yyyy');
                }
                else if (a == 1 && scope.formData.nomineeDetails && scope.formData.nomineeDetails[1] && scope.formData.nomineeDetails[1].dateOfBirth) {
                    scope.date = dateFilter(new Date(scope.formData.nomineeDetails[1].dateOfBirth), 'dd-MM-yyyy');
                }
                else if (a == 2 && scope.formData.coClientData && scope.formData.coClientData[0] && scope.formData.coClientData[0].dateOfBirth) {
                    scope.date = dateFilter(new Date(scope.formData.coClientData[0].dateOfBirth), 'dd-MM-yyyy');
                }
                var today = dateFilter(new Date(), 'dd-MM-yyyy');

                try {
                    scope.birthDate = scope.date.split('-');
                } catch (err) {

                }

                scope.todayDates = today.split('-');
                var age = scope.todayDates[2] - scope.birthDate[2];
                var m = scope.todayDates[1] - scope.birthDate[1];
                if (m < 0 || (m === 0 && scope.todayDates[0] < scope.birthDate[0])) {
                    age--;
                }
                if (a == 0 && this.formData.nomineeDetails && this.formData.nomineeDetails[0]) {
                    this.formData.nomineeDetails[0].age = age;
                }
                else if (a == 1 && this.formData.nomineeDetails && this.formData.nomineeDetails[1]) {
                    this.formData.nomineeDetails[1].age = age;

                }
                else if (a == 2 && this.formData.coClientData && this.formData.coClientData[0]) {
                    this.formData.coClientData[0].age = age;
                }
            }

            scope.addressaboveSetting = function () {
                if (scope.addressabove) {
                    var idObj2 = "";
                    if (scope.formData.naddress[1] && scope.formData.naddress[1].id) {
                        idObj2 = scope.formData.naddress[1].id;
                    }
                    scope.formData.naddress[1] = jQuery.extend(true, {}, scope.formData.naddress[0]);
                    if (!isNaN(idObj2)) {
                        scope.formData.naddress[1].id = idObj2;
                    }
                }
            };

            scope.showNotification = function () {
                scope.annualRevenueId = scope.formData.clientExt.annualIncome;
                for (var i in scope.annualIncomeOptions) {
                    if (scope.annualIncomeOptions[i].id == scope.formData.clientExt.annualIncome) {
                        scope.revenue = scope.annualIncomeOptions[i].name;
                        break;
                    }
                }
                if (!angular.isUndefined(scope.revenue)) {
                    if (scope.revenue.indexOf('-') != -1) {
                        scope.annualIncomeData = scope.revenue.split("-");
                        scope.lowerlimit1 = scope.annualIncomeData[0].split(".")
                        var lowerlimit = scope.lowerlimit1[1].replace(/,/g, '');
                        var upperlimit = scope.annualIncomeData[1].replace(/,/g, '');
                        if (parseInt(scope.totalRevenue) < parseInt(lowerlimit)) {
                            scope.cashflowmishmatch == true;
                            return true;
                        }
                        else if (parseInt(scope.totalRevenue) > parseInt(upperlimit)) {
                            scope.cashflowmishmatch == true
                            return true;
                        }
                    }
                    else {
                        scope.annualIncomeData = scope.revenue.split("Rs.")
                        if (scope.annualIncomeData[0] === '> ') {
                            var upperlimit = scope.annualIncomeData[1].replace(/,/g, '');
                            if (parseInt(scope.totalRevenue) < parseInt(upperlimit)) {
                                scope.cashflowmishmatch == true;
                                return true;
                            }
                        }
                        else {
                            var upperlimit = scope.annualIncomeData[1].replace(/,/g, '');
                            if (parseInt(scope.totalRevenue) > parseInt(upperlimit)) {
                                scope.cashflowmishmatch == true
                                return true;
                            }
                        }
                    }

                }
                //  }
            };

            scope.keyPress = function () {
                scope.totalRevenue = 0;
                scope.totalExpense = 0;
                scope.totalSurplus = 0;
                var f = 0;
                for (var l in scope.cfaOccupations) {
                    if (scope.cfaOccupations[l].revenue != null && scope.cfaOccupations[l].revenue != "" && scope.cfaOccupations[l].expense != null && scope.cfaOccupations[l].expense != "") {
                        if (parseInt(scope.cfaOccupations[l].expense) > parseInt(scope.cfaOccupations[l].revenue)) {
                            scope.cfaOccupations[l].surplus = (scope.cfaOccupations[l].revenue - scope.cfaOccupations[l].expense);
                            scope.totalRevenue = parseInt(scope.totalRevenue) + parseInt(scope.cfaOccupations[l].revenue);
                            scope.totalExpense = parseInt(scope.totalExpense) + parseInt(scope.cfaOccupations[l].expense);
                            scope.totalSurplus = scope.totalSurplus + scope.cfaOccupations[l].surplus;
                        }
                        else {
                            scope.cfaOccupations[l].surplus = (scope.cfaOccupations[l].revenue - scope.cfaOccupations[l].expense);
                            scope.totalRevenue = parseInt(scope.totalRevenue) + parseInt(scope.cfaOccupations[l].revenue);
                            scope.totalExpense = parseInt(scope.totalExpense) + parseInt(scope.cfaOccupations[l].expense);
                            scope.totalSurplus = scope.totalSurplus + scope.cfaOccupations[l].surplus;
                        }
                    }
                }
            }

            scope.nomineeaddressabove = false;
            scope.nomineeaddressSetting = function () {
                if (scope.nomineeaddressabove) {
                    var idObj2 = "";
                    if (scope.formData.nomineeDetails[1] && scope.formData.nomineeDetails[1].id) {
                        idObj2 = scope.formData.nomineeDetails[1].id;
                    }
                    scope.formData.nomineeDetails[1] = jQuery.extend(true, {}, scope.formData.nomineeDetails[0]);
                    if (!isNaN(idObj2)) {
                        scope.formData.nomineeDetails[1].id = idObj2;
                    }
                }
            };

            scope.$watch("formData.familyDetails", function (newValue, oldValue) {
                if (scope.formData.familyDetails && scope.formData.familyDetails.length > 0) {
                    for (var i in scope.formData.familyDetails) {
                        if (scope.formData.familyDetails[i] && scope.formData.familyDetails[i].dateOfBirth) {
                            var dateOfBirth = scope.formData.familyDetails[i].dateOfBirth;
                            if ((new Date(dateOfBirth)).toString() != 'Invalid Date') {
                                scope.autoCalculateAge('familymember', i);
                            }
                        }
                    }
                }
            });

            scope.familyAutoCalcAge = function () {
                if (scope.formData.familyDetails && scope.formData.familyDetails.length > 0) {
                    for (var i in scope.formData.familyDetails) {
                        if (scope.formData.familyDetails[i] && scope.formData.familyDetails[i].dateOfBirth) {
                            var dateOfBirth = scope.formData.familyDetails[i].dateOfBirth;
                            if ((new Date(dateOfBirth)).toString() != 'Invalid Date') {
                                scope.autoCalculateAge('familymember', i);
                            }
                        }
                    }
                }
            };

            scope.autoCalculateAge = function (type, index) {
                scope.birthDate = [];
                scope.todayDates = [];
                scope.date = "";
                if (type == 'familymember') {
                    scope.date = dateFilter(new Date(scope.formData.familyDetails[index].dateOfBirth), 'dd-MM-yyyy');
                }

                var today = dateFilter(new Date(), 'dd-MM-yyyy');
                scope.birthDate = scope.date.split('-');
                scope.todayDates = today.split('-');
                var age = scope.todayDates[2] - scope.birthDate[2];
                var m = scope.todayDates[1] - scope.birthDate[1];
                if (m < 0 || (m === 0 && scope.todayDates[0] < scope.birthDate[0])) {
                    age--;
                }
                if (type == 'familymember') {
                    scope.formData.familyDetails[index].age = age;
                }
            };

            scope.familyAutoCalcAge();

            scope.submitAndAccept = function () {
                scope.addressaboveSetting();
                scope.result = false;//scope.showNotification();
                if (scope.result != true) {
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.df;
                    if (scope.opensavingsproduct == 'false') {
                        this.formData.savingsProductId = null;
                    }
                    if (scope.choice === 1) {
                        if (scope.formData.activationDate) {
                            this.formData.activationDate = dateFilter(scope.formData.activationDate, scope.df);
                        }
                    }

                    if (scope.formData.dateOfBirth) {
                        this.formData.dateOfBirth = dateFilter(scope.formData.dateOfBirth, scope.df);
                    }

                    if (scope.formData.submittedOnDate) {
                        this.formData.submittedOnDate = dateFilter(scope.formData.submittedOnDate, scope.df);
                    }

                    if (this.formData.familyDetails) {
                        for (var i = 0; i < this.formData.familyDetails.length; i++) {
                            if (this.formData.familyDetails[i].dateOfBirth) {
                                this.formData.familyDetails[i].dateOfBirth = dateFilter(new Date(scope.formData.familyDetails[i].dateOfBirth), scope.df);
                            }
                            this.formData.familyDetails[i].locale = scope.optlang.code;
                            this.formData.familyDetails[i].dateFormat = scope.df;
                        }
                    }

                    if (this.formData.naddress) {
                        for (var i = 0; i < this.formData.naddress.length; i++) {
                            if(!this.formData.naddress[i].addressType || this.formData.naddress[i].addressType < 1){
                                if (i == 0) {
                                    for (var j = 0; j < scope.addressTypes.length; j++) {
                                        if (scope.addressTypes[j].name == 'Comuniation Address') {
                                            this.formData.naddress[i].addressType = scope.addressTypes[j].id;
                                        }
                                    }
                                } else if (i == 1) {
                                    for (var j = 0; j < scope.addressTypes.length; j++) {
                                        if (scope.addressTypes[j].name == 'KYC address') {
                                            this.formData.naddress[i].addressType = scope.addressTypes[j].id;
                                        }
                                    }
                                } else if (i == 2) {
                                    for (var j = 0; j < scope.addressTypes.length; j++) {
                                        if (scope.addressTypes[j].name == 'Spouse Address') {
                                            this.formData.naddress[i].addressType = scope.addressTypes[j].id;
                                        }
                                    }
                                }
                            }
                            this.formData.naddress[i].locale = scope.optlang.code;
                            this.formData.naddress[i].dateFormat = scope.df;
                        }
                    }

                    if (scope.cfaOccupations) {
                        this.formData.cfaOccupations = scope.cfaOccupations;
                        for (var i = 0; i < this.formData.cfaOccupations.length; i++) {
                            this.formData.cfaOccupations[i].locale = scope.optlang.code;
                        }
                    }

                    if (this.formData.nomineeDetails) {
                        for (var i = 0; i < this.formData.nomineeDetails.length; i++) {
                            if (this.formData.nomineeDetails[i].dateOfBirth) {
                                this.formData.nomineeDetails[i].dateOfBirth = dateFilter(scope.formData.nomineeDetails[i].dateOfBirth, scope.df);
                            }
                            if (this.formData.nomineeDetails[i].guardianDateOfBirth) {
                                this.formData.nomineeDetails[i].guardianDateOfBirth = dateFilter(scope.formData.nomineeDetails[i].guardianDateOfBirth, scope.df);
                            }
                            this.formData.nomineeDetails[i].locale = scope.optlang.code;
                            this.formData.nomineeDetails[i].dateFormat = scope.df;
                        }
                    }

                    if (this.formData.coClientData) {
                        for (var i = 0; i < this.formData.coClientData.length; i++) {
                            if (this.formData.coClientData[i].relationship) {
                                this.formData.coClientData[i].clientId = scope.formData.clientId;
                                if (scope.formData.coClientData[i].dateOfBirth) {
                                    this.formData.coClientData[i].dateOfBirth = dateFilter(scope.formData.coClientData[i].dateOfBirth, scope.df);
                                }
                                this.formData.coClientData[i].locale = scope.optlang.code;
                                this.formData.coClientData[i].dateFormat = scope.df;
                            }
                        }
                    }

                    for (var i = 0; i < this.formData.naddress.length; i++) {
                        if (!this.formData.naddress[i].state || this.formData.naddress[i].state == 0 || isNaN(this.formData.naddress[i].state)) {
                            this.formData.naddress.splice(i, 1);
                        }
                    }

                    scope.familyAutoCalcAge();

                    resourceFactory.clientResource.update({'clientId': routeParams.id}, this.formData, function (data) {
                        location.path('/viewclient/' + routeParams.id);
                    });
                }
                else {
                    scope.cashflowmishmatch = true;
                }

            }

        }

    });
    mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', mifosX.controllers.EditClientController]).run(function ($log) {
        $log.info("EditClientController initialized");
    });
}(mifosX.controllers || {}));
