(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientController: function (scope, routeParams, route, location, resourceFactory, http, $modal, API_VERSION, $rootScope, $upload, dateFilter) {
            scope.client = [];
            scope.identitydocuments = [];
            scope.buttons = [];
            scope.clientdocuments = [];
            scope.staffData = {};
            scope.formData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.updateDefaultSavings = false;
            scope.loanviewactiveclose=true;
            scope.savingsviewactiveclose=true
            scope.active=true;
            scope.correspondenceAddress1=[];
            scope.savingactive=true;
            scope.clientbankdetails={};
            scope.showaddbutton=true;
            scope.clientId=routeParams.id;
            scope.showextradetails=false;
            scope.rblcustomerData ={};
            scope.gurdianTitleOptions =[];
            scope.gurdianrelationOptions=[];
            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };
            scope.routeToSavings =function(id){
                location.path('/viewsavingaccount/' + id);
            };
            scope.routeToSaving = function (id, depositTypeCode) {
                if (depositTypeCode === "depositAccountType.savingsDeposit") {
                    location.path('/viewsavingaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.fixedDeposit") {
                    location.path('/viewfixeddepositaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.recurringDeposit") {
                    location.path('/viewrecurringdepositaccount/' + id);
                }
            };
            scope.activecloseLoan = function(){
                if(!this.loanviewactiveclose){
                    scope.active=false;
                }
                else{
                    scope.active=true;
                }
            }
           scope.healthOptions=[{"id":1,"name":"Normal"},{"id":2,"name":"Partial sa"},{"id":3,"name":"Physically Challenged"},{"id":4,"name":"Mentally Challenged"},{"id":5,"name":"gir"},{"id":6,"name":"Blind"},{"id":7,"name":"One"}];
            scope.languageOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.languageOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.mothertoungOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.caedissueflagOptions =[{"id":0,"name":"False"},{"id":1,"name":"True"}];
            scope.cbchckOptions =[{"id":0,"name":"Yes"},{"id":1,"name":"No"}];
            scope.renwalflagOptions=[{"id":0,"name":"No"},{"id":1,"name":"Yes"}];
            scope.gurdiangenderOptions=[{"id":0,"name":"Male"},{"id":1,"name":"Female"},{"id":2,"name":"Others"},{"id":3,"name":"Transgender"}];

            resourceFactory.rblcustomerresource.get({customerId:routeParams.id}, function (clientData) {
                var requestParams = {staffInSelectedOfficeOnly: true};
                requestParams.officeId = 1;


                scope.rblcustomerData=clientData;
                if(angular.isUndefined(clientData.clientId)){
                    scope.showextradetails=false;
                }else{
                    scope.showextradetails=true;
                }
                scope.extradetailsId=clientData.clientId;
               // scope.rblcustomerData=clientData;
                resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                    scope.gurdianTitleOptions = clientData.salutation;
                    scope.gurdianrelationOptions = clientData.familyrelationShip;

                    if(clientData.caedissueflag==0){
                    scope.rblcustomerData.caedissueflag="false";
                }else{
                    scope.rblcustomerData.caedissueflag="true";
                }

                if(clientData.cbchck==0){
                    scope.rblcustomerData.cbchck="Yes";
                }else{
                    scope.rblcustomerData.cbchck="No";
                }
                if(clientData.renwalflag==0){
                    scope.rblcustomerData.renwalflag="Yes";
                }else{
                    scope.rblcustomerData.renwalflag="No";
                }

                for(var i=0;i<scope.gurdiangenderOptions.length;i++){
                    if(clientData.gurdiangender==scope.gurdiangenderOptions[i].id){
                        scope.rblcustomerData.gurdiangender=scope.gurdiangenderOptions[i].name;
                        break;
                    }
                }
                for(var i=0;i<scope.healthOptions.length;i++){
                    if(clientData.health==scope.healthOptions[i].id){
                        scope.rblcustomerData.health=scope.healthOptions[i].name;
                        break;
                    }
                }

                    for(var i=0;i<scope.gurdianTitleOptions.length;i++){

                        if(scope.rblcustomerData.gurdianTitle ==scope.gurdianTitleOptions[i].id){
                            scope.rblcustomerData.gurdianTitle=scope.gurdianTitleOptions[i].name;
                            break;
                        }
                    }
                    for(var i=0;i<scope.gurdianrelationOptions.length;i++){
                        if(clientData.relation ==scope.gurdianrelationOptions[i].id){
                            scope.rblcustomerData.relation=scope.gurdianrelationOptions[i].name;
                            break;
                        }
                    }

                });

               /* for(var i=0;i<scope.languageOptions.length;i++){
                    if(clientData.language==scope.languageOptions[i].id){
                        scope.rblcustomerData.health=scope.languageOptions[i].name;
                    }
                }
                for(var i=0;i<scope.mothertoungOptions.length;i++){
                    if(clientData.mothertoung==scope.mothertoungOptions[i].id){
                        scope.rblcustomerData.mothertoung=scope.mothertoungOptions[i].name;
                    }
                }*/

            });

            scope.activecloseSavings = function(){
                if(!this.savingsviewactiveclose){
                    scope.savingactive=false;
                }
                else{
                    scope.savingactive=true;
                }
            }
            scope.haveFile = [];
            resourceFactory.clientResource.get({clientId: routeParams.id}, function (data) {
                scope.client = data;
                scope.clientData = data.clientDetailedData;
                                                                                                                                                                                   scope.formData.coClientData = [{}];
                scope.coClientData = "";
                if(scope.clientData.coapplicantDetailsData.coapplicantData.length > 0){
                    scope.formData.coClientData = scope.clientData.coapplicantDetailsData.coapplicantData;
                    for(var i in scope.formData.coClientData) {
                        if (scope.formData.coClientData[i].dateOfBirth) {
                            var dateOfBirth = dateFilter(scope.formData.coClientData[i].dateOfBirth, scope.df);
                            scope.formData.coClientData[i].dateOfBirth = new Date(dateOfBirth);
                        }
                    }

                    var coFatherDisplayName = "";
                    if(scope.formData.coClientData[0].fatherFirstName){
                        coFatherDisplayName = scope.formData.coClientData[0].fatherFirstName;
                    }
                    if(scope.formData.coClientData[0].fatherMiddleName){
                        coFatherDisplayName += " "+scope.formData.coClientData[0].fatherMiddleName;
                    }
                    if(scope.formData.coClientData[0].fatherLastName){
                        coFatherDisplayName += " "+scope.formData.coClientData[0].fatherLastName;
                    }
                    scope.formData.coClientData[0].coFatherDisplayName = coFatherDisplayName;

                    var coDisplayName = "";
                    if(scope.formData.coClientData[0].firstName){
                        coDisplayName = scope.formData.coClientData[0].firstName;
                    }
                    if(scope.formData.coClientData[0].middleName){
                        coDisplayName += " "+scope.formData.coClientData[0].middleName;
                    }
                    if(scope.formData.coClientData[0].lastName){
                        coDisplayName += " "+scope.formData.coClientData[0].lastName;
                    }
                    scope.formData.coClientData[0].coDisplayName = coDisplayName;
                }
                if(scope.formData.coClientData[0]){
                    scope.coClientDataDisplay = scope.formData.coClientData[0];
                }

                //console.log(JSON.stringify(scope.coClientDataDisplay));

                for(var i in data.clientDetailedData.addressExtData){
                    if(data.clientDetailedData.addressExtData[i].addressTypeLable == 'Comuniation Address'){
                        scope.communicationAddress = data.clientDetailedData.addressExtData[i];
                    }else if(data.clientDetailedData.addressExtData[i].addressTypeLable == 'KYC address'){
                        scope.kycAddress = data.clientDetailedData.addressExtData[i];
                    }else if(data.clientDetailedData.addressExtData[i].addressTypeLable == 'Spouse Address'){
                        scope.correspondenceAddress = data.clientDetailedData.addressExtData[i];
                        /*alert(JSON.stringify(scope.correspondenceAddress1[i]));
                        if(scope.correspondenceAddress1.length==3)
                        {
                            scope.correspondenceAddress=scope.correspondenceAddress1[i];
                            alert("3");
                        }*/
                    }
                }

                scope.isClosedClient = scope.client.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                if (data.imagePresent) {
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images?maxHeight=150'
                    }).then(function (imageData) {
                        scope.image = imageData.data;
                    });
                }
                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents'
                }).then(function (docsData) {
                    var docId = -1;
                    for (var i = 0; i < docsData.data.length; ++i) {
                        if (docsData.data[i].name == 'clientSignature') {
                            docId = docsData.data[i].id;
                            scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        }
                    }
                });

                scope.navigateToSavingsOrDepositAccount = function (eventName, accountId, savingProductType) {
                    switch(eventName) {

                        case "deposit":
                            if(savingProductType==100)
                                location.path('/savingaccount/' + accountId + '/deposit');
                            if(savingProductType==300)
                                location.path('/recurringdepositaccount/' + accountId + '/deposit');
                            break;
                        case "withdraw":
                            if(savingProductType==100)
                                location.path('/savingaccount/' + accountId + '/withdrawal');
                            if(savingProductType==300)
                                location.path('/recurringdepositaccount/' + accountId + '/withdrawal');
                            break;
                    }
                }

                
                var clientStatus = new mifosX.models.ClientStatus();

                if (clientStatus.statusKnown(data.status.value)) {
                    scope.buttons = clientStatus.getStatus(data.status.value);
                    scope.savingsActionbuttons = [
                            {
                                name: "button.deposit",
                                type: "100",
                                icon: "icon-arrow-right",
                                taskPermissionName: "DEPOSIT_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.withdraw",
                                type: "100",
                                icon: "icon-arrow-left",
                                taskPermissionName: "WITHDRAW_SAVINGSACCOUNT"
                            },
                            {
                                name: "button.deposit",
                                type: "300",
                                icon: "icon-arrow-right",
                                taskPermissionName: "DEPOSIT_RECURRINGDEPOSITACCOUNT"
                            },
                            {
                                name: "button.withdraw",
                                type: "300",
                                icon: "icon-arrow-left",
                                taskPermissionName: "WITHDRAW_RECURRINGDEPOSITACCOUNT"
                            }
                        ];
                }

                if (data.status.value == "Pending" || data.status.value == "Active") {
                    if (data.staffId) {

                    }
                    else {
                        scope.buttons.push(clientStatus.getStatus("Assign Staff"));
                    }
                }

                scope.buttonsArray = {
                    options: [
                        {
                            name: "button.clientscreenreports"
                        }
                    ]
                };
                scope.buttonsArray.singlebuttons = scope.buttons;
                resourceFactory.runReportsResource.get({reportSource: 'ClientSummary', genericResultSet: 'false', R_clientId: routeParams.id}, function (data) {
                    scope.client.ClientSummary = data[0];
                   // console.log('dddddd ----> : ',JSON.stringify(data));
                });
            });
            scope.deleteClient = function () {
                $modal.open({
                    templateUrl: 'deleteClient.html',
                    controller: ClientDeleteCtrl
                });
            };
            scope.uploadPic = function () {
                $modal.open({
                    templateUrl: 'uploadpic.html',
                    controller: UploadPicCtrl
                });
            };
            var UploadPicCtrl = function ($scope, $modalInstance) {
                $scope.onFileSelect = function ($files) {
                    scope.file = $files[0];
                };
                $scope.upload = function () {
                    if (scope.file) {
                        $upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                            data: {},
                            file: scope.file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $modalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.capturePic = function () {
                $modal.open({
                    templateUrl: 'capturepic.html',
                    controller: CapturePicCtrl,
                    windowClass: 'modalwidth700'
                });
            };
            var CapturePicCtrl = function ($scope, $modalInstance) {

                $scope.video = null;
                $scope.picture = null;
                $scope.error = null;

                $scope.onVideoSuccess = function (video) {
                    $scope.video = video;
                    $scope.error = null;
                };

                $scope.onVideoError = function (err) {
                    if(typeof err != "undefined")
                        $scope.error = err.message + '(' + err.name + ')';
                };

                $scope.takeScreenshot = function () {
                    var picCanvas = document.createElement('canvas');
                    var width = $scope.video.width;
                    var height = $scope.video.height;

                    picCanvas.width = width;
                    picCanvas.height = height;
                    var ctx = picCanvas.getContext("2d");
                    ctx.drawImage($scope.video, 0, 0, width, height);
                    var imageData = ctx.getImageData(0, 0, width, height);
                    document.querySelector('#clientSnapshot').getContext("2d").putImageData(imageData, 0, 0);
                    $scope.picture = picCanvas.toDataURL();
                };
                $scope.uploadscreenshot = function () {
                    if($scope.picture != null) {
                        http({
                            method: 'POST',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                            data: $scope.picture
                        }).then(function (imageData) {
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $modalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.reset = function () {
                    $scope.picture = null;
                }
            };
            scope.deletePic = function () {
                $modal.open({
                    templateUrl: 'deletePic.html',
                    controller: DeletePicCtrl
                });
            };
            var DeletePicCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images',
                    }).then(function (imageData) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        $modalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            scope.uploadSig = function () {
                $modal.open({
                    templateUrl: 'uploadsig.html',
                    controller: UploadSigCtrl
                });
            };
            var UploadSigCtrl = function ($scope, $modalInstance) {
                $scope.onFileSelect = function ($files) {
                    scope.file = $files[0];
                };
                $scope.upload = function () {
                    if (scope.file) {
                        $upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents',
                            data: {
                                name: 'clientSignature',
                                description: 'client signature'
                            },
                            file: scope.file,
                        }).then(function (imageData) {
                                // to fix IE not refreshing the model
                                if (!scope.$$phase) {
                                    scope.$apply();
                                }
                                $modalInstance.close('upload');
                                route.reload();
                            });
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            scope.unassignStaffCenter = function () {
                $modal.open({
                    templateUrl: 'clientunassignstaff.html',
                    controller: ClientUnassignCtrl
                });
            };
            var ClientDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                    resourceFactory.clientResource.delete({clientId: routeParams.id}, {}, function (data) {
                        $modalInstance.close('delete');
                        location.path('/clients');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var ClientUnassignCtrl = function ($scope, $modalInstance) {
                $scope.unassign = function () {
                    resourceFactory.clientResource.save({clientId: routeParams.id, command: 'unassignstaff'}, scope.staffData, function (data) {
                        $modalInstance.close('unassign');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            resourceFactory.clientAccountResource.get({clientId: routeParams.id}, function (data) {
                scope.clientAccounts = data;
                if (data.savingsAccounts) {
                    for (var i in data.savingsAccounts) {
                        if (data.savingsAccounts[i].status.value == "Active") {
                            scope.updateDefaultSavings = true;
                            break;
                        }
                    }
                }
            });
            scope.isClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.isSavingClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.setLoan = function () {
                if (scope.openLoan) {
                    scope.openLoan = false
                } else {
                    scope.openLoan = true;
                }
            };
            scope.setSaving = function () {
                if (scope.openSaving) {
                    scope.openSaving = false;
                } else {
                    scope.openSaving = true;
                }
            };
            resourceFactory.clientNotesResource.getAllNotes({clientId: routeParams.id}, function (data) {
                scope.clientNotes = data;
            });
            scope.getClientIdentityDocuments = function () {
                resourceFactory.clientResource.getAllClientDocuments({clientId: routeParams.id, anotherresource: 'identifiers'}, function (data) {
                    scope.identitydocuments = data;
                    for (var i = 0; i < scope.identitydocuments.length; i++) {
                        resourceFactory.clientIdentifierResource.get({clientIdentityId: scope.identitydocuments[i].id}, function (data) {
                            for (var j = 0; j < scope.identitydocuments.length; j++) {
                                if (data.length > 0 && scope.identitydocuments[j].id == data[0].parentEntityId) {
                                    for (var l in data) {

                                        var loandocs = {};
                                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                                        data[l].docUrl = loandocs;
                                    }
                                    scope.identitydocuments[j].documents = data;
                                }
                            }
                        });
                    }
                });
            };
            scope.delebankDetails1=function(bankId) {
                for (var p in  scope.clientdocuments) {
                if (scope.clientdocuments[p].name === 'Scan copy of passbook') {
                    scope.documentid = scope.clientdocuments[p].id;
                }
            }
                resourceFactory.clientbankDetailsResourceforsave.deletebankdetails({bankdetailsId: bankId},function(data){
                }
            );
                resourceFactory.clientDocumentsResource.delete({clientId: routeParams.id, documentId: scope.documentid}, '', function (data) {
                });
               scope.showaddbutton=true;
                //route.reload();
               // route.reload();
            };
            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_client'}, function (data) {
                scope.clientdatatables = data;
            });
            resourceFactory.clientbankDetailsResource.get({clientId:routeParams.id},function(data){
                scope.clientbankdetails=data;
                if(data.id>0){
                    scope.showaddbutton=false;
                }
            });

            scope.dataTableChange = function (clientdatatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: clientdatatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.showDataTableAddButton = !scope.datatabledetails.isData || scope.datatabledetails.isMultirow;
                    scope.showDataTableEditButton = scope.datatabledetails.isData && !scope.datatabledetails.isMultirow;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        }
                    }
                    if (scope.datatabledetails.isData) {
                        for (var i in data.columnHeaders) {
                            if (!scope.datatabledetails.isMultirow) {
                                var row = {};
                                row.key = data.columnHeaders[i].columnName;
                                row.value = data.data[0].row[i];
                                scope.singleRow.push(row);
                            }
                        }
                    }
                });
            };

            scope.viewstandinginstruction = function () {
                location.path('/liststandinginstructions/' + scope.client.officeId + '/' + scope.client.id);
            };
            scope.createstandinginstruction = function () {
                location.path('/createstandinginstruction/' + scope.client.officeId + '/' + scope.client.id + '/fromsavings');
            };
            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.getClientDocuments = function () {
                resourceFactory.clientDocumentsResource.getAllClientDocuments({clientId: routeParams.id}, function (data) {
                    for (var l in data) {
                        var loandocs = {};
                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = loandocs;
                    }
                    scope.clientdocuments = data;
                });
            };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.clientDocumentsResource.delete({clientId: routeParams.id, documentId: documentId}, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.viewDataTable = function (registeredTableName, data) {
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/" + registeredTableName + "/" + scope.client.id + "/" + data.row[0]);
                } else {
                    location.path("/viewsingledatatableentry/" + registeredTableName + "/" + scope.client.id);
                }
            };

            scope.downloadDocument = function (documentId) {
                resourceFactory.clientDocumentsResource.get({clientId: routeParams.id, documentId: documentId}, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.isLoanNotClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.isSavingNotClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.saveNote = function () {
                resourceFactory.clientResource.save({clientId: routeParams.id, anotherresource: 'notes'}, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.clientNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            scope.deleteClientIdentifierDocument = function (clientId, entityId, index) {
                resourceFactory.clientIdenfierResource.delete({clientId: clientId, id: entityId}, '', function (data) {
                    scope.identitydocuments.splice(index, 1);
                });
            };

            scope.downloadClientIdentifierDocument = function (identifierId, documentId) {
                console.log(identifierId, documentId);
            };
            // devcode: !production
            // *********************** InVenture controller ***********************

            scope.fetchInventureScore = function () {
                // dummy data for the graph - DEBUG purpose
                var inventureScore = getRandomInt(450, 800);
                var natAverage = getRandomInt(450, 800);
                var industryAverage = getRandomInt(450, 800);
                var inventureMinScore = 300;
                var inventureMaxScore = 850;

                // dummy data for inventure loan recommendation - DEBUG purpose
                scope.inventureAgricultureLimit = '21,000';
                scope.inventureFishermenLimit = '27,500';
                scope.inventureHousingLimit = '385,000';
                scope.inventureBusinessLimit = '10,000';

                // this part is used to generate data to see the look of the graph
                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                // CHART1 - comparison chart control
                var comparisonData = [
                    {
                        key: "Score Comparison",
                        values: [
                            {
                                "label": "National Average",
                                "value": (natAverage)
                            },
                            {
                                "label": "Agriculture Average",
                                "value": (industryAverage)
                            },
                            {
                                "label": "This Client",
                                "value": (inventureScore)
                            }
                        ]
                    }
                ];

                // add the comparison chart to the viewclient.html
                nv.addGraph(function () {
                    var comparisonChart = nv.models.discreteBarChart()
                        .x(function (d) {
                            return d.label
                        })
                        .y(function (d) {
                            return d.value
                        })
                        .staggerLabels(true)
                        .tooltips(true)
                        .showValues(true);

                    // set all display value to integer
                    comparisonChart.yAxis.tickFormat(d3.format('d'));
                    comparisonChart.valueFormat(d3.format('d'));
                    comparisonChart.forceY([inventureMinScore, inventureMaxScore]);

                    d3.select('#inventureBarChart svg')
                        .datum(comparisonData)
                        .transition().duration(1500)
                        .call(comparisonChart);

                    nv.utils.windowResize(comparisonChart.update);
                    return comparisonChart;
                });

                // CHART2 - inventure score bullet chart control
                nv.addGraph(function () {
                    var bullet = nv.models.bulletChart()
                        .tooltips(false);

                    d3.select('#inventureBulletChart svg')
                        .datum(scoreData())
                        .transition().duration(1500)
                        .call(bullet);

                    nv.utils.windowResize(bullet.update);
                    return bullet;
                });

                function scoreData() {
                    return {
                        "title": "",
                        "ranges": [(inventureMinScore - 300), (inventureMaxScore - 300)],
                        "measures": [(inventureScore - 300)],
                        "markers": [(inventureScore - 300)]};
                }

                // this will be used to display the score on the viewclient.html
                scope.inventureScore = inventureScore;
            };

            scope.showSignature = function()
            {
                $modal.open({
                    templateUrl: 'clientSignature.html',
                    controller: ViewLargerClientSignature,
                    size: "lg"
                });
             };

            scope.showWithoutSignature = function()
            {
                $modal.open({
                    templateUrl: 'clientWithoutSignature.html',
                    controller: ViewClientWithoutSignature,
                    size: "lg"
                });
            };

            scope.showPicture = function () {
                $modal.open({
                    templateUrl: 'photo-dialog.html',
                    controller: ViewLargerPicCtrl,
                    size: "lg"
                });
            };

            var ViewClientWithoutSignature = function($scope,$modalInstance){
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var ViewLargerClientSignature = function($scope,$modalInstance){
                    var loadSignature = function(){
                     http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents'
                     }).then(function (docsData) {
                        var docId = -1;
                        for (var i = 0; i < docsData.data.length; ++i) {
                            if (docsData.data[i].name == 'clientSignature') {
                                docId = docsData.data[i].id;
                                scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                            }
                        }
                    if (scope.signature_url != null) {
                        http({
                            method: 'GET',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier
                    }).then(function (docsData) {
                            $scope.largeImage = scope.signature_url;
                        });
                    }
                    });
                };
                loadSignature();
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
             };

            var ViewLargerPicCtrl = function ($scope, $modalInstance) {
                var loadImage = function () {
                    if (scope.client.imagePresent) {
                        http({
                            method: 'GET',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + routeParams.id + '/images?maxWidth=860'
                        }).then(function (imageData) {
                            $scope.largeImage = imageData.data;
                        });
                    }
                };
                loadImage();
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        }
    });

    mifosX.ng.application.controller('ViewClientController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$http', '$modal', 'API_VERSION', '$rootScope', '$upload', 'dateFilter', mifosX.controllers.ViewClientController]).run(function ($log) {
        $log.info("ViewClientController initialized");
    });
}(mifosX.controllers || {}));
