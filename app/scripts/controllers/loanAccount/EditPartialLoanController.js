(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPartialLoanController: function (scope, rootScope, routeParams, resourceFactory, location, dateFilter) {
            scope.response = {success:[],failed:[]};
            scope.center = {};
            scope.previewRepayment = false;
            scope.center.id = routeParams.centerId;
            scope.staffInSelectedOfficeOnly = true;
            scope.requestIdentifier = "clientId";
            scope.inparams = { resourceType: 'template', templateType: 'jlgbulk', lendingStrategy: 300 };
            scope.selectedProduct = {};
            scope.loanApplicationCommonData = {};  // user set common data for all the loan applications
            scope.loanApplicationCommonData.submittedOnDate = new Date();
            scope.loanApplicationCommonData.expectedDisbursementDate = new Date();
            // scope.loanApplicationCommonData.syncDisbursementWithMeeting = true;
            scope.groupName='';
            scope.clients=[];
            scope.selectedClients=[];
            scope.selectedClients1=[];
            scope.charges=[];
            scope.formData={};
            scope.chargeName='';
            scope.groups=[];
            scope.approveData={};
            scope.principalChange=false;
            scope.showdatails=true;
            scope.loanstatus=false;
            scope.remarkstatus=false;
            scope.cbreceivedate=false;
            scope.sequenceNumberData=[]
            if (scope.center.id) {
                scope.inparams.centerId = scope.center.id;
            }

            // Fetch loan products for initital product drop-down
            resourceFactory.loanResource.get(scope.inparams, function (data) {
                scope.products = data.productOptions;
                scope.loanProductChange(scope.products[0].id);
                if (data.center) {
                    scope.center.name = data.center.name;
                }
            });
            resourceFactory.partialLoanResourceforget.get({parentId:scope.center.id,isSequenceNumber:true,isUpdateStatus:true}, function (data) {
                scope.sequenceNumberData=data;
            });

            resourceFactory.partialLoanResourceforgettemplate.get({parentId:scope.center.id,isActive:1,isDisburse:0}, function (data) {
                scope.statusOptions = data.status;
                scope.acceptedclientsIdOptions=data.acceptedclientsId;

                if(scope.acceptedclientsIdOptions.length==0){
                    scope.showdatails=false;
                }
            });
            scope.changePrincipal=function(){
                scope.principalChange=true;
            }

            scope.loanProductChange = function (loanProductId) {

                scope.inparams.productId = loanProductId;
                resourceFactory.loanResource.get(scope.inparams, function (data) {
                    scope.loanaccountinfo=data;
                    scope.productDetails = data.product;
                    scope.groups=data.center.groupMembers;
                    scope.loanOfficers = data.loanOfficerOptions;
                    scope.funds = data.fundOptions;
                    scope.caledars = data.calendarOptions;
                    scope.loanPurposes = data.loanPurposeOptions;
                    scope.termFrequency = data.termFrequency;
                    scope.termPeriodFrequencyType = data.termPeriodFrequencyType;
                    scope.emi=null;
                    scope.clientId=scope.groups[0].activeClientMembers[0].id;
                    for(var i in data.product.charges){
                        scope.chargeName=scope.chargeName+data.product.charges[i].name;
                    }
                    //  scope.previewRepayments(null,data.principal,scope.clientId,data.product.charges,null,null);
                    for( var i in scope.groups ) {
                        scope.clients[i] = scope.groups[i].activeClientMembers.map(function (client) {
                            client.principal = data.product.principal;
                            client.groupId=scope.groups[i].id;
                            for(var p=0;p<=scope.sequenceNumberData.length;p++){
                                if(scope.sequenceNumberData[p].clientId==client.id){
                                    client.extId=scope.sequenceNumberData[p].SequenceNumber;
                                    break;
                                }
                            }
                            client.charges = data.product.charges.map(function (charge) {
                                charge.isDeleted = false;
                                return _.clone(charge);
                            });
                            scope.selectedClients.push(client);
                            scope.selectedClients1.push(client);
                            return client;
                        });
                        scope.groups[i].activeClientMembers=scope.selectedClients1;
                        scope.selectedClients1 =[];
                    }

                });
            };


            scope.selectgroup=function(index,groupId){
                if(groupId!=null){
                    scope.groups[index].isSelected=false;
                }else{
                    scope.groups[index].isSelected=true;
                }
                if(groupId==null) {
                    scope.index1 = 0;
                    angular.forEach(scope.groups[index].activeClientMembers, function (item) {
                        if (!angular.isUndefined(scope.groups[index].activeClientMembers[scope.index1].isSelected)) {
                            scope.groups[index].activeClientMembers[scope.index1].isSelected = true;
                            scope.index1++;
                        }
                        else {
                            scope.groups[index].activeClientMembers[scope.index1].isSelected = true;
                            scope.index1++;
                        }
                    });
                }

            }
            scope.toggleCharge = function (groupIndex,clientIndex, chargeIndex) {
                if(scope.groups[groupIndex].activeClientMembers[clientIndex].charges[chargeIndex].isDeleted){
                    scope.groups[groupIndex].activeClientMembers[clientIndex].charges[chargeIndex].isDeleted=false;
                }
                else{
                    scope.groups[groupIndex].activeClientMembers[clientIndex].charges[chargeIndex].isDeleted = true;
                }

            };
            scope.previewRepayments = function (outerIndex,principal,clientId,charges1,selectedgroupIndex,EmiAmount) {
                delete scope.formData.charges;
                this.formData.amortizationType = scope.productDetails.amortizationType.id;
                this.formData.clientId = clientId;
                this.formData.fundId = scope.loanApplicationCommonData.fundId;
                if (charges1 != null) {
                    scope.charges = charges1;
                }
                else{
                    scope.formData.charges = [];
                    for (var j in   scope.groups[selectedgroupIndex].activeClientMembers[outerIndex].charges) {
                        if(! scope.groups[selectedgroupIndex].activeClientMembers[outerIndex].charges[j].isDeleted){
                            var charge = {};
                            charge.amount =  scope.groups[selectedgroupIndex].activeClientMembers[outerIndex].charges[j].amount;
                            charge.chargeId =  scope.groups[selectedgroupIndex].activeClientMembers[outerIndex].charges[j].id;
                            scope.formData.charges.push(charge);
                        }
                    }


                }

                if (scope.loanApplicationCommonData.syncDisbursementWithMeeting) {
                    this.formData.calendarId =  scope.caledars[0].id;
                    scope.syncRepaymentsWithMeeting = scope.loanApplicationCommonData.syncDisbursementWithMeeting;;
                }
                delete this.formData.syncRepaymentsWithMeeting;

                this.formData.interestChargedFromDate = dateFilter(scope.loanApplicationCommonData.submittedOnDate, scope.df);
                this.formData.repaymentsStartingFromDate = dateFilter(scope.loanApplicationCommonData.submittedOnDate, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.loanType = "individual";
                this.formData.productId=scope.productDetails.id;
                this.formData.loanTermFrequency= scope.termFrequency;
                this.formData.loanTermFrequencyType= scope.termPeriodFrequencyType;
                this.formData.principal = principal;
                this.formData.expectedDisbursementDate = dateFilter(scope.loanApplicationCommonData.expectedDisbursementDate, scope.df);
                this.formData.submittedOnDate =  dateFilter(scope.loanApplicationCommonData.submittedOnDate, scope.df);
                this.formData.interestCalculationPeriodType = scope.productDetails.interestCalculationPeriodType.id;
                this.formData.numberOfRepayments = scope.productDetails.numberOfRepayments;
                this.formData.interestRatePerPeriod = scope.productDetails.interestRatePerPeriod;
                this.formData.interestCalculationPeriodType = scope.productDetails.interestCalculationPeriodType.id;
                this.formData.interestType = scope.productDetails.interestType.id;
                this.formData.loanTermFrequency = scope.termFrequency;
                this.formData.loanTermFrequencyType = scope.termPeriodFrequencyType.id;
                this.formData.repaymentEvery = scope.productDetails.repaymentEvery;
                this.formData.repaymentFrequencyType = scope.productDetails.repaymentFrequencyType.id;
                this.formData.transactionProcessingStrategyId = scope.productDetails.transactionProcessingStrategyId;

                if (EmiAmount != null && EmiAmount!='Nan' ) {
                    this.formData.fixedEmiAmount = EmiAmount;
                }

                resourceFactory.loanResource.save({command: 'calculateLoanSchedule'}, this.formData, function (data) {
                    scope.repaymentscheduleinfo = data;

                    if(outerIndex!=null) {
                        scope.previewRepayment = true;
                    }
                    if(scope.principalChange==false){
                        for(var i in scope.groups){
                            for(var j in scope.groups[i].activeClientMembers){
                                if(EmiAmount!=null){
                                    if(scope.groups[i].activeClientMembers[j].id==clientId){
                                        scope.groups[i].activeClientMembers[j].emi= scope.repaymentscheduleinfo.periods[1].totalDueForPeriod;
                                    }
                                }
                                else{
                                    scope.groups[i].activeClientMembers[j].emi= scope.repaymentscheduleinfo.periods[1].totalDueForPeriod;
                                }}
                        }}else{
                        scope.groups[selectedgroupIndex].activeClientMembers[outerIndex].emi= scope.repaymentscheduleinfo.periods[1].totalDueForPeriod;

                        scope.principalChange=false;
                    }

                    scope.formData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;

                });
            }


            scope.submit = function () {
                scope.loanstatus=false;
                scope.remarkstatus=false;
                scope.cbreceivedate=false;

                if (angular.isUndefined(scope.loanApplicationCommonData.cbreceivedate)) {
                    scope.cbreceivedate = true;
                }
                for (var i in scope.selectedClients ) {
                if( scope.selectedClients[i].isSelected ) {
                    if (angular.isUndefined(scope.selectedClients[i].status1)) {
                        scope.loanstatus = true;
                    }
                    if (angular.isUndefined(scope.selectedClients[i].remark)) {
                        scope.remarkstatus = true;
                    }

                }
                }
                if (!scope.loanstatus && !scope.remarkstatus && !scope.cbreceivedate ) {
                    this.batchRequests = [];
                    for (var i in scope.selectedClients) {
                        if (scope.selectedClients[i].isSelected) {

                            var loanapplication = {};

                            loanapplication.locale = scope.optlang.code;
                            loanapplication.dateFormat = scope.df;
                            loanapplication.groupId = scope.selectedClients[i].groupId;
                            loanapplication.clientId = scope.selectedClients[i].id;
                            loanapplication.productId = scope.productDetails.id;
                            loanapplication.cbreceivedate=dateFilter(scope.loanApplicationCommonData.cbreceivedate, scope.df);

                            loanapplication.externalId = scope.selectedClients[i].extId;
                            loanapplication.loanPurposeId = scope.selectedClients[i].loanPurposeId;
                            loanapplication.status = scope.selectedClients[i].status1;
                            loanapplication.remark = scope.selectedClients[i].remark;
                            resourceFactory.partialLoanResourceforupdate.update({
                                clientId: loanapplication.clientId,
                                groupId: loanapplication.groupId
                            }, loanapplication, function (data) {
                            });

                        }

                    }
                    location.path('/viewcenter/' + scope.center.id);
                }

            };

            /* Cancel button action */
            scope.cancel = function () {
                if (scope.center.id) {
                    location.path('/viewcenter/' + scope.center.id);
                }
            };


        } // End of NewJLGLoanAccAppController

    });
    mifosX.ng.application.controller('EditPartialLoanController', ['$scope', '$rootScope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditPartialLoanController]).run(function ($log) {
        $log.info("EditPartialLoanController initialized");
    });
}(mifosX.controllers || {}));