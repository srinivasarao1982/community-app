(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams, $parse, $q, $modal, $scope,$timeout) {

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

            scope.isDatafilled = false;
            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.first.submitondate = new Date();
            scope.formData = {};
            scope.formData.clientExt = {};
            scope.formData.naddress = [{}, {}];
            scope.formData.clientIdentifierData = [{}, {}];
            scope.formData.nomineeDetails = [{}, {}];
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.clientObject = {};
            scope.selected = false;
            scope.formData.familyDetails = [{}];
            scope.sourceOfLoans = [{}, {}];
            scope.restrictDate = new Date();
            scope.cashflowmishmatch = false;
            scope.rblOffice=[];
            //  scope.dobStartFrom = new Date("1980-01-01");

            // scope.dobStartFrom = new Date("1980-01-01");

            //scope.formData.dateOfBirth = scope.dobStartFrom;

            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                scope.rblOffice=data.allowedParents;
            });
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:false,isSequenceNumber:true,entityId:1},function(data){
                scope.sequenceNumber=data.sequenceNo;
              //  this.formData.externalId=scope.sequenceNumber;
            });
            var requestParams = {staffInSelectedOfficeOnly: true};
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }

            scope.$watch('formData.nomineeDetails[0].dateOfBirth', function () {
                //scope.AgeCalculate(0);
            });
            scope.$watch('formData.nomineeDetails[1].dateOfBirth', function () {
                // scope.AgeCalculate(1);
            });

            scope.AgeCalculate = function (a) {

                scope.birthDate = [];
                scope.todayDates = [];
                if (a == 0) {
                    scope.date = dateFilter(this.formData.nomineeDetails[0].dateOfBirth, 'dd-MM-yyyy');
                }
                else {
                    scope.date = dateFilter(this.formData.nomineeDetails[1].dateOfBirth, 'dd-MM-yyyy');
                }
                var today = dateFilter(new Date(), 'dd-MM-yyyy');
                scope.birthDate = scope.date.split('-');
                scope.todayDates = today.split('-');
                var age = scope.todayDates[2] - scope.birthDate[2];
                var m = scope.todayDates[1] - scope.birthDate[1];
                if (m < 0 || (m === 0 && scope.todayDates[0] < scope.birthDate[0])) {
                    age--;
                }
                if (a == 0) {
                    this.formData.nomineeDetails[0].age = age;
                }
                else {
                    this.formData.nomineeDetails[1].age = age;

                }
            }

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

            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                //console.log(JSON.stringify(clientData));
                data = clientData.clientBasicDetails;
                scope.salutations = clientData.salutation;
                scope.formData.clientExt.salutation = scope.salutations[2].id;
                scope.martialStatusOptions = clientData.maritalStatus;
                scope.formData.clientExt.maritalStatus=clientData.maritalStatus[0].id;
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
               // scope.formData.genderId = scope.genderOptions[0].id;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
               // scope.formData.clientClassificationId = scope.clientClassificationOptions[0].id;
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;

                scope.identityProofOptions = [];
                for (var i in clientData.identityProof) {
                    if (clientData.identityProof[i].name && clientData.identityProof[i].name.indexOf('Coapplicant-') < 0) {
                        scope.identityProofOptions.push(clientData.identityProof[i]);
                    }
                }

                scope.addressProofOptions = [];
                for (var i in clientData.addressProof) {
                    if (clientData.addressProof[i].name && clientData.addressProof[i].name.indexOf('Coapplicant-') < 0) {
                        scope.addressProofOptions.push(clientData.addressProof[i]);
                    }
                }

                scope.cfaOccupations = clientData.cfaOccupation;
                scope.addressTypes = clientData.addressTypes;
                scope.familyrelationShipOptions = clientData.familyrelationShip;
                scope.presentLoanSourceTypes = clientData.presentLoanSourceTypes
                scope.presentLoanPurposeTypes = clientData.presentLoanPurposeTypes;
                scope.autofillHolder = "";
                scope.spouseRelationShips = clientData.spouseRelationShip;
                scope.formData.clientExt.spouseRelationShip = scope.spouseRelationShips[1].id;
                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }

                if (routeParams.officeId) {
                    scope.rblOffice=[];

                    resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                        scope.rblOffice=data.allowedParents;

                        resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:false,isSequenceNumber:true,entityId:1},function(data){
                            scope.sequenceNumber=data.sequenceNo;
                            for(var i=0;i<scope.rblOffice.length;i++){

                                if(routeParams.officeId==scope.rblOffice[i].id){
                                    scope.formData.externalId= scope.sequenceNumber;
                                    break;
                                }
                            }
                        });
                    });

                    scope.formData.officeId = routeParams.officeId;
                    for (var i in data.officeOptions) {
                        if (data.officeOptions[i].id == routeParams.officeId) {
                            scope.forceOffice = data.officeOptions[i];
                            break;
                        }
                    }
                }
                if (routeParams.groupId) {
                    if (typeof data.staffId !== "undefined") {
                        scope.formData.staffId = data.staffId;
                    }
                }


                // Sensible default values

                // Educational qualification

                var educationObj = _.find(scope.eductionalQualificationOptions, function (item) {
                    return item.name.toLowerCase().indexOf("10th") > -1;
                });

                if (educationObj != undefined && educationObj != null && educationObj != "") {
                    scope.formData.clientExt.educationalQualification = educationObj.id;
                }


                // Professional

                var profObj = _.find(scope.ProfessionOptions, function (item) {
                    return item.name.toLowerCase().indexOf("farmer") > -1;
                });

                if (profObj != undefined && profObj != null && profObj != "") {
                    scope.formData.clientExt.profession = profObj.id;
                }


                // Professional

                var annualIncomeObj = _.find(scope.annualIncomeOptions, function (item) {
                    return item.name.toLowerCase().indexOf("60,001-1,20,000") > -1;
                });

                if (annualIncomeObj != undefined && annualIncomeObj != null && annualIncomeObj != "") {
                    scope.formData.clientExt.annualIncome = annualIncomeObj.id;
                }


                // Professional

                var landHoldingObj = _.find(scope.landHoldings, function (item) {
                    return item.name.toLowerCase().indexOf("landless") > -1;
                });

                if (landHoldingObj != undefined && landHoldingObj != null && landHoldingObj != "") {
                    scope.formData.clientExt.landholding = landHoldingObj.id;
                }


                // House ownership type

                var houseObj = _.find(scope.houseTypes, function (item) {
                    return item.name.toLowerCase().indexOf("own") > -1;
                });

                if (houseObj != undefined && houseObj != null && houseObj != "") {
                    scope.formData.clientExt.houseType = houseObj.id;
                }


                // PAN form type

                var panFormObj = _.find(scope.panForms, function (item) {
                    return item.name.toLowerCase().indexOf("no") > -1;
                });

                if (panFormObj != undefined && panFormObj != null && panFormObj != "") {
                    scope.formData.clientExt.panForm = panFormObj.id;

                }

                //RelationShip type
                var relationShipObj = _.find(scope.spouseRelationShips, function (item) {
                    return item.name.toLowerCase().indexOf("no") > -1;
                });

                if (relationShipObj != undefined && relationShipObj != null && relationShipObj != "") {
                    scope.formData.clientExt.spouseRelationShip = relationShipObj.id;
                }

                //Address
                for (var i = 0; i < scope.formData.naddress.length; i++) {
                    if (scope.stateOptions[0] && scope.stateOptions[0].id) {
                        scope.formData.naddress[i].state = scope.stateOptions[0].id;
                    }
                }
            });

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

            scope.autoFill = function () {
                scope.selected = false;

                if (scope.autofillHolder.length > 25) {
                    if (window.DOMParser) {
                        parser = new DOMParser();
                    }
                    else {
                        alert("Browser not supported!");
                        return null;
                    }

                    xmlDoc = parser.parseFromString(scope.autofillHolder, 'text/xml');
                    var barCodedData = xmlDoc.getElementsByTagName("PrintLetterBarcodeData");
                    if (barCodedData != undefined && barCodedData != null && barCodedData != "") {
                        var barCodedDataObject = barCodedData[0];

                        scope.formData.clientExt.aadhaarNo = barCodedDataObject.getAttribute("uid");
                        // Name derived
                        var fullName = barCodedDataObject.getAttribute("name").toUpperCase();
                        var names = fullName.split(" ");
                        var isFirstNameDerived = false;
                        var isMidNameDerived = false;
                        var isLastNameDerived = false;
                        var fistName = "";
                        var midName = "";
                        var lastName = "";

                        // Need to improve the name splitting logic for all scenarios

                        if (names.length == 2) {
                            isMidNameDerived = true;
                        }


                        for (var i = 0; i < names.length; i++) {

                            if (!isFirstNameDerived) {
                                fistName = names[i];
                                isFirstNameDerived = true;
                            } else if (!isMidNameDerived) {
                                midName = names[i];
                                isMidNameDerived = true;
                            } else {
                                lastName = lastName + names[i];
                            }

                        }
                        scope.formData.firstname = fistName;
                        scope.formData.middlename = midName;
                        scope.formData.lastname = lastName;

                        // date of birth derived
                        var dob = barCodedDataObject.getAttribute("dob");

                        if (dob != undefined && dob != null && dob != "") {
                            var dates = dob.split("/");
                            if (dates.length < 2) {
                                var dates = dob.split("-");
                                scope.formData.dateOfBirth = new Date(dates[0], dates[1] - 1, dates[2]);
                            }
                            else {
                                scope.formData.dateOfBirth = new Date(dates[2], dates[1] - 1, dates[0]);
                            }
                        } else {
                            var yob = barCodedDataObject.getAttribute("yob");
                            scope.formData.dateOfBirth = new Date(yob, 5, 1);
                        }


                        // Gender

                        var gender = barCodedDataObject.getAttribute("gender");
                        var genderSearchString = "female";
                        if (gender.toLowerCase() == "m") {
                            genderSearchString = "male";
                        }


                        var genderObj = _.find(scope.genderOptions, function (item) {
                            return item.name.toLowerCase() == genderSearchString;
                        });

                        //console.log("genderObj: " + genderObj);

                        scope.formData.genderId = genderObj.id;

                        var gname = barCodedDataObject.getAttribute("gname");
                        if (gname != null && gname != undefined && gname != "") {
                            scope.formData.clientExt.spfirstname = gname;
                        }

                        // Spouse or fother name derived

                        var co = barCodedDataObject.getAttribute("co");
                        if (co != null) {
                            co = co.toUpperCase();
                            var cos = co.split(" ");
                            var iscoFirstNameDerived = false;
                            var iscoMidNameDerived = false;
                            var iscoLastNameDerived = false;
                            var cofistName = "";
                            var comidName = "";
                            var colastName = "";
                            var startCos = 0;


                            if (co.indexOf("/") > -1) {
                                startCos = 1;
                            }
                            ;


                            if (cos.length == 3) {
                                iscoMidNameDerived = true;
                            } else if (cos.length == 1) {
                                startCos = 0;
                            }

                            // Need to improve the name splitting logic for all scenarios
                            for (var i = startCos; i < cos.length; i++) {
                                if (!iscoFirstNameDerived) {

                                    if ((cos[i].toLowerCase().indexOf("late") > -1 && cos[i].length <= 6 ) || cos[i].length <= 2) {
                                        cofistName = cofistName + " " + cos[i];
                                    } else {
                                        cofistName = cofistName + " " + cos[i];
                                        iscoFirstNameDerived = true;
                                    }


                                } else if (!iscoMidNameDerived) {
                                    comidName = cos[i];
                                    iscoMidNameDerived = true;
                                } else {
                                    colastName = colastName + cos[i];
                                }

                            }

                            scope.formData.clientExt.spfirstname = cofistName;
                            scope.formData.clientExt.spmiddlename = comidName;
                            scope.formData.clientExt.splastname = colastName;


                            // Salutation

                            var salSearchString = "mrs";
                            var marStatSearchString = "married";


                            if (cos.length == 1) {
                                salSearchString = "mrs"
                                marStatSearchString = "married";
                            } else if (cos[0].toLowerCase().indexOf("d/o") > -1) {
                                salSearchString = "ms";
                                marStatSearchString = "single";
                            } else if (cos[0].toLowerCase().indexOf("late") > -1 && cos[0].length <= 6) {
                                salSearchString = "mrs"
                                marStatSearchString = "widow";
                            } else if (cos[1].toLowerCase().indexOf("late") > -1 && cos[1].length <= 6) {
                                salSearchString = "mrs"
                                marStatSearchString = "widow";
                            }

                            var salObj = _.find(scope.salutations, function (item) {
                                return item.name.toLowerCase() == salSearchString;
                            });
                            if (salObj != undefined && salObj != null && salObj != "") {
                                scope.formData.clientExt.salutation = salObj.id;
                            }
                        }
                        // Marital status

                        var marStatObj = _.find(scope.martialStatusOptions, function (item) {
                            return item.name.toLowerCase() == marStatSearchString;
                        });

                        if (marStatObj != undefined && marStatObj != null && marStatObj != "") {
                            scope.formData.clientExt.maritalStatus = marStatObj.id;
                        }

                        // Address details

                        var houseNo = barCodedDataObject.getAttribute("house");
                        var street = barCodedDataObject.getAttribute("street");
                        var loc = barCodedDataObject.getAttribute("loc");
                        var vtc = barCodedDataObject.getAttribute("vtc");
                        var po = barCodedDataObject.getAttribute("po");
                        var dist = barCodedDataObject.getAttribute("dist");
                        var subdist = barCodedDataObject.getAttribute("subdist");
                        var state = barCodedDataObject.getAttribute("state");
                        var pc = barCodedDataObject.getAttribute("pc");

                        if (houseNo != undefined && houseNo != null) {
                            scope.formData.naddress[0].houseNo = houseNo.toUpperCase();

                            scope.formData.naddress[1].houseNo = houseNo.toUpperCase();

                        }

                        if (street != undefined && street != null) {
                            scope.formData.naddress[0].streetNo = street.toUpperCase();

                            scope.formData.naddress[1].streetNo = street.toUpperCase();

                        }

                        if (loc != undefined && loc != null) {
                            scope.formData.naddress[0].areaLocality = loc.toUpperCase();

                            scope.formData.naddress[1].areaLocality = loc.toUpperCase();
                        }

                        if (po != undefined && po != null) {
                            scope.formData.naddress[0].landmark = po.toUpperCase();

                            scope.formData.naddress[1].landmark = po.toUpperCase();

                        }

                        if (vtc != undefined && vtc != null) {
                            scope.formData.naddress[0].villageTown = vtc.toUpperCase();

                            scope.formData.naddress[1].villageTown = vtc.toUpperCase();

                        }

                        if (pc != undefined && pc != null) {
                            scope.formData.naddress[0].pinCode = pc.toUpperCase();
                            ;
                            scope.formData.naddress[1].pinCode = pc.toUpperCase();
                            ;
                        }

                        if (subdist != undefined && subdist != null) {
                            scope.formData.naddress[0].taluka = subdist.toUpperCase();

                            scope.formData.naddress[0].taluka = subdist.toUpperCase();

                        }


                        if (dist != undefined && dist != null) {
                            var distObj = _.find(scope.districtOptins, function (item) {
                                return item.name.toLowerCase() == dist.toLowerCase();
                            });

                            if (distObj != undefined && distObj != null) {
                                scope.formData.naddress[0].district = distObj.id;
                                scope.formData.naddress[1].district = distObj.id;
                            }

                        }


                        if (state != undefined && state != null) {
                            var stateObj = _.find(scope.stateOptions, function (item) {
                                return item.name.toLowerCase() == state.toLowerCase();
                            });
                            if (stateObj != undefined && stateObj != null) {
                                scope.formData.naddress[0].state = stateObj.id;
                                scope.formData.naddress[1].state = stateObj.id;
                            }
                        }


                        // Identity and address proof


                        var idenityObj = _.find(scope.identityProofOptions, function (item) {
                            return item.name.toLowerCase() == "aadhaar";
                        });

                        if (idenityObj != undefined && idenityObj != null) {
                            scope.formData.clientIdentifierData[0].documentTypeId = idenityObj.id;
                        }
                        scope.formData.clientIdentifierData[0].documentKey = barCodedDataObject.getAttribute("uid");


                        var addressObj = _.find(scope.addressProofOptions, function (item) {
                            return item.name.toLowerCase() == "aadhaar";
                        });

                        if (addressObj != undefined && addressObj != null) {
                            scope.formData.clientIdentifierData[1].documentTypeId = addressObj.id;
                        }
                        scope.formData.clientIdentifierData[1].documentKey = barCodedDataObject.getAttribute("uid");


                        scope.addressabove = true;
                        scope.isDatafilled = true;
                        scope.autofillHolder = "";


                    }
                    else {
                        alert("Invalid read! Please read again.");
                    }

                }
                else {
                    alert("Invalid read! Please read again.");
                }

            };

            scope.changeOffice = function (officeId) {
                for(var i=0;i<scope.rblOffice.length;i++){

                    if(officeId==scope.rblOffice[i].id){
                        scope.formData.externalId= scope.sequenceNumber;
                            break;
                    }
                }
                resourceFactory.clientTemplateResource.get({
                    staffInSelectedOfficeOnly: true, officeId: officeId
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
            if (routeParams.groupId) {
                scope.cancel = '#/viewgroup/' + routeParams.groupId
                scope.groupid = routeParams.groupId;
            } else {
                scope.cancel = "#/clients"
            }

            scope.addressabove = false;
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
            scope.addFamilyDetails = function () {
                var family = {};
                scope.formData.familyDetails.push(family);
            };

            scope.deleteFamilyDetails = function (index) {
                scope.formData.familyDetails.splice(index, 1);
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
                //this.formData.mobileNo = scope.formData.naddress[1].mobileNo;
                this.formData.mobileNo = scope.formData.naddress[0].mobileNo;

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


                for (var i in this.formData.familyDetails) {
                    if (this.formData.familyDetails[i].dateOfBirth) {
                        this.formData.familyDetails[i].dateOfBirth = dateFilter(scope.formData.familyDetails[i].dateOfBirth, scope.df);
                    }
                }

                if (this.formData.naddress) {
                    for (var i = 0; i < this.formData.naddress.length; i++) {
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
                                    //this.formData.mobileNo=scope.formData.naddress[0].mobileNo;
                                }
                            }
                        }
                        this.formData.naddress[i].locale = scope.optlang.code;
                        this.formData.naddress[i].dateFormat = scope.df;
                    }
                }

                if (this.formData.familyDetails) {
                    for (var i = 0; i < this.formData.familyDetails.length; i++) {
                        this.formData.familyDetails[i].locale = scope.optlang.code;
                        this.formData.familyDetails[i].dateFormat = scope.df;
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
                        this.formData.nomineeDetails[i].locale = scope.optlang.code;
                        this.formData.nomineeDetails[i].dateFormat = scope.df;
                    }
                }

                for (var i in this.formData.nomineeDetails) {
                    if (this.formData.nomineeDetails[i].dateOfBirth) {
                        this.formData.nomineeDetails[i].dateOfBirth = dateFilter(scope.formData.nomineeDetails[i].dateOfBirth, scope.df);
                    }
                    if (this.formData.nomineeDetails[i].guardianDateOfBirth) {
                        this.formData.nomineeDetails[i].guardianDateOfBirth = dateFilter(scope.formData.nomineeDetails[i].guardianDateOfBirth, scope.df);
                    }
                }

                for (var i = 0; i < this.formData.naddress.length; i++) {
                    if (!this.formData.naddress[i].state || this.formData.naddress[i].state == 0 || isNaN(this.formData.naddress[i].state)) {
                        this.formData.naddress.splice(i, 1);
                    }
                }

                scope.familyAutoCalcAge();

                //console.log(JSON.stringify(this.formData));


                scope.addressproffError =false;
                scope.identificationProfferror=false;
                if ( angular.isUndefined(scope.formData.clientIdentifierData[0].documentTypeId)) {
                    scope.identificationProfferror = true;
                }
                if ( angular.isUndefined(scope.formData.clientIdentifierData[0].documentKey)) {
                    scope.identificationProfferror = true;
                }


                if (angular.isUndefined(scope.formData.clientIdentifierData[1].documentTypeId)) {
                    scope.addressproffError = true;
                }
                if (angular.isUndefined(scope.formData.clientIdentifierData[1].documentKey)) {
                    scope.addressproffError = true;
                }

                if (!scope.addressproffError &&  !scope.identificationProfferror) {
                resourceFactory.clientResource.save(this.formData, function (data) {
                    location.path('/createcoclient/' + data.clientId);
                });
                }
            }

            }

    });
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', '$parse', '$q', '$modal','$scope','$timeout', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
