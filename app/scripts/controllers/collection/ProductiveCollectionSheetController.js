(function (module) {
    mifosX.controllers = _.extend(module, {
        ProductiveCollectionSheetController: function (scope, routeParams, resourceFactory, dateFilter, location) {
            var params = {};
            params.locale = scope.optlang.code;
            params.dateFormat = scope.df;
            params.meetingDate = routeParams.meetingDate;
            params.officeId = routeParams.officeId;
            params.staffId = routeParams.staffId;
            if (params.staffId === "undefined") {
                params.staffId = null;
            }
            var centerIdArray = [];
            scope.submitNextShow = true;
            scope.submitShow = false;
            scope.completedCenter = false;
            scope.officeName = routeParams.officeName;
            scope.meetingDate = routeParams.meetingDate;
            var submittedStaffId = [];
            scope.details = false;
            scope.showPaymentDetails = false;
            scope.showerror=false;


            resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
                if (data[0]) {
                    scope.staffCenterData = data[0].meetingFallCenters;
                    for (var i = 0; i < scope.staffCenterData.length; i++) {
                        centerIdArray.push({id: scope.staffCenterData[i].id, calendarId: scope.staffCenterData[i].collectionMeetingCalendar.id});
                    }
                    scope.getAllGroupsByCenter(data[0].meetingFallCenters[0].id, data[0].meetingFallCenters[0].collectionMeetingCalendar.id);
                }
            });

            //scope.showPaymentDetailsFn = function () {
            scope.paymentDetail = {};
                scope.showPaymentDetails = true;
            scope.paymentDetail.paymentTypeId = "";
            scope.paymentDetail.accountNumber = "";
            scope.paymentDetail.checkNumber = "";
            scope.paymentDetail.routingCode = "";
            scope.paymentDetail.receiptNumber = "";
            scope.paymentDetail.bankNumber = "";
         // };
            
            scope.detailsShow = function() {
                if (scope.details) {
                    scope.details = false;
                } else {
                    scope.details = true;
                }
            }

            scope.getAllGroupsByCenter = function (centerId, calendarId) {
                scope.submitNextShow = true;
                scope.submitShow = false;
                if (centerIdArray.length-1 === submittedStaffId.length || centerIdArray.length === 1) {
                    scope.submitNextShow = false;
                    scope.submitShow = true;
                }
                scope.selectedTab = centerId;
                scope.centerId = centerId;
                scope.calendarId = calendarId;
                scope.formData = {};
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                scope.formData.calendarId = scope.calendarId;
                scope.formData.transactionDate = routeParams.meetingDate;
                for (var i = 0; i < submittedStaffId.length; i++) {
                    if (centerId == submittedStaffId[i].id) {
                        scope.submitNextShow = false;
                        scope.submitShow = false;
                        break;
                    }
                }
                resourceFactory.centerResource.save({'centerId': scope.centerId, command: 'generateCollectionSheet'}, scope.formData, function (data) {
                    scope.collectionsheetdata = data;
                    if (scope.collectionsheetdata.paymentTypeOptions.length > 0) {
                        scope.paymentDetail.paymentTypeId = scope.collectionsheetdata.paymentTypeOptions[0].id;
                    }
                    scope.clientsAttendanceArray(data.groups);
                    scope.total(data);
                });
            };

            scope.bulkRepaymentTransactionAmountChange = function () {
                scope.collectionData = scope.collectionsheetdata;
                scope.total(scope.collectionData);
            };

            scope.clientsAttendanceArray = function (groups) {
                var gl = groups.length;
                for (var i = 0; i < gl; i++) {
                    scope.clients = groups[i].clients;
                    var cl = scope.clients.length;
                    for (var j = 0; j < cl; j++) {
                        scope.client = scope.clients[j];
                        if (scope.client.attendanceType.id === 0) {
                            scope.client.attendanceType.id = 1;
                        }
                    }
                }
            };

            function deepCopy(obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }
            

            /**
             * Sum of loan dues and Savings dues group by group and product
             */
            scope.sumGroupDueCollection = function () {
                scope.savingsGroupsTotal = [];
                scope.savingsProductArray = [];            
                
                for (var i = 0; i < scope.collectionsheetdata.savingsProducts.length; i++) {
                    savingsProductTemp = {
                        productId: scope.collectionsheetdata.savingsProducts[i].id,
                        productName: scope.collectionsheetdata.savingsProducts[i].name,
                        depositAmount: 0
                    }
                    scope.savingsProductArray.push(savingsProductTemp);
                }

                _.each(scope.groupArray, function (group) {
                        _.each(group.clients, function (client) {
                            _.each(client.savings, function (saving) {
                                scope.sumGroupSavingsDueCollection(group, saving);
                            });
                        });
                    }
                );
            };

            /**
             * Sum of savings dues group by group id and savings product id
             * @param group
             * @param saving
             */
            scope.sumGroupSavingsDueCollection = function (group, saving) {
                var existing = _.findWhere(scope.savingsGroupsTotal, {groupId: group.groupId, productId: saving.productId});
                var dueAmount = saving.dueAmount;
                if (isNaN(dueAmount)) {
                    dueAmount = parseInt(0);
                }
                if (existing === 'undefined' || !(_.isObject(existing))) {
                    var gp = {
                        groupId: group.groupId,
                        productId: saving.productId,
                        dueAmount: dueAmount,
                        currencyCode: saving.currency.code,
                        currencySymbol: saving.currency.displaySymbol
                    };

                    scope.savingsGroupsTotal.push(gp);
                } else {
                    existing.dueAmount = Math.ceil((Number(existing.dueAmount) + Number(dueAmount)) * 100) / 100;
                }

                var savingsProductTotalDeposit = _.findWhere(scope.savingsProductArray, {productId: saving.productId});
                
                if ( !(savingsProductTotalDeposit === 'undefined') || (_.isObject(savingsProductTotalDeposit))) {
                    savingsProductTotalDeposit.depositAmount =  Math.ceil((Number(savingsProductTotalDeposit.depositAmount) + Number(dueAmount)) * 100) / 100;
                }


            };


            scope.total = function (data) {

                scope.groupArray = scope.collectionsheetdata.groups;

                /* sumGroupDueCollection computes total savings gue per group */
                scope.sumGroupDueCollection();

                scope.bulkRepaymentTransactions = [];
                scope.bulkSavingsDueTransactions = [];
                scope.bulkDisbursementTransactions = [];
                scope.groupTotal = [];
                scope.loanProductArray = [];

                scope.loanDueTotalCollections = [];

                for (var i = 0; i < data.loanProducts.length; i++) {
                    loanProductTemp = {
                        productId: data.loanProducts[i].id,
                        productName: data.loanProducts[i].name,
                        transactionAmount: 0,
                        disbursementAmount: 0
                    }
                    scope.loanProductArray.push(loanProductTemp);
                }


                var gl = scope.groupArray.length;
                for (var i = 0; i < gl; i++) {
                    var loanProductArrayDup = deepCopy(scope.loanProductArray);

                    var temp = {};
                    temp.groupId = scope.groupArray[i].groupId;

                    scope.clientArray = scope.groupArray[i].clients;
                    var cl = scope.clientArray.length;
                    for (var j = 0; j < cl; j++) {
                        scope.loanArray = scope.clientArray[j].loans;
                        var ll = scope.loanArray.length;
                        for (var k = 0; k < ll; k++) {
                            scope.loan = scope.loanArray[k];
                            if (scope.loan.totalDue > 0) {
                                scope.bulkRepaymentTransactions.push({
                                    loanId: scope.loan.loanId,
                                    transactionAmount: scope.loan.totalDue
                                });
                            }

                            for (var l = 0; l < loanProductArrayDup.length; l++) {
                                if (loanProductArrayDup[l].productId == scope.loan.productId) {
                                    if (scope.loan.chargesDue) {
                                        loanProductArrayDup[l].transactionAmount = Number(loanProductArrayDup[l].transactionAmount + Number(scope.loan.totalDue) + Number(scope.loan.chargesDue));
                                        loanProductArrayDup[l].transactionAmount = Math.ceil(loanProductArrayDup[l].transactionAmount * 100) / 100;
                                    } else {
                                        loanProductArrayDup[l].transactionAmount = Number(loanProductArrayDup[l].transactionAmount + Number(scope.loan.totalDue));
                                    }
                                }
                            }
                        }
                    }
                    temp.loanProductArrayDup = loanProductArrayDup;
                    scope.groupTotal.push(temp);
                }

                var loanProductArrayTotal = deepCopy(scope.loanProductArray);
                for (var i = 0; i < scope.groupTotal.length; i++) {
                    var groupProductTotal = scope.groupTotal[i];
                    for (var j = 0; j < groupProductTotal.loanProductArrayDup.length; j++) {
                        var productObjectTotal = groupProductTotal.loanProductArrayDup[j];
                        for (var k = 0; k < loanProductArrayTotal.length; k++) {
                            var productArrayTotal = loanProductArrayTotal[k];
                            if (productObjectTotal.productId == productArrayTotal.productId) {
                                productArrayTotal.transactionAmount = productArrayTotal.transactionAmount + productObjectTotal.transactionAmount;
                                productArrayTotal.disbursementAmount = productArrayTotal.disbursementAmount + productObjectTotal.disbursementAmount;
                            }
                        }
                    }
                }




                _.each(scope.groupArray, function (group) {
                        _.each(group.clients, function (client) {
                            _.each(client.savings, function (saving) {
                                var dueAmount = saving.dueAmount;
                                if(!angular.isUndefined(dueAmount)) {
                                    if (dueAmount > 0) {
                                        var savingsDepositTransaction = {
                                            savingsId: saving.savingsId,
                                            transactionAmount: dueAmount
                                        };
                                        scope.bulkSavingsDueTransactions.push(savingsDepositTransaction);
                                    }
                                }
                            });
                        });
                    });


                scope.grandTotal = loanProductArrayTotal;

                // xxx
            }

            scope.viewFullScreen = function () {
                var element = document.getElementById("productive_sheet");
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            };

            scope.submit = function () {
                scope.showerror=false;
               scope.total(scope.collectionsheetdata);

                scope.formData.calendarId = scope.calendarId;
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                if(routeParams.transactionDate!=null){
                   scope.formData.transactionDate = dateFilter(routeParams.transactionDate, scope.df);
                }
                else{
                    scope.formData.transactionDate = dateFilter(routeParams.meetingDate, scope.df);
                }
                scope.formData.clientsAttendance = scope.clientsAttendance;
                scope.formData.bulkDisbursementTransactions = [];
                scope.formData.bulkRepaymentTransactions = scope.bulkRepaymentTransactions;
                scope.formData.bulkSavingsDueTransactions = scope.bulkSavingsDueTransactions;
                scope.formData.paymentTypeId = scope.paymentDetail.paymentTypeId;
                scope.formData.accountNumber = scope.paymentDetail.accountNumber;
                scope.formData.checkNumber = scope.paymentDetail.checkNumber;
                scope.formData.routingCode =scope.paymentDetail.routingCode;
                scope.formData.receiptNumber = scope.paymentDetail.receiptNumber;
                if(scope.paymentDetail.receiptNumber=="") {
                    scope.showerror=true;
                }
                scope.formData.bankNumber = scope.paymentDetail.bankNumber;
                if( scope.showerror==false) {
                    resourceFactory.centerResource.save({
                        'centerId': scope.centerId,
                        command: 'saveCollectionSheet'
                    }, scope.formData, function (data) {
                        for (var i = 0; i < centerIdArray.length; i++) {
                            if (scope.centerId === centerIdArray[i].id && centerIdArray.length >= 1) {
                                scope.staffCenterData[i].submitted = true;
                                submittedStaffId.push({id: scope.staffCenterData[i].id});
                            }

                        }

                        if (centerIdArray.length === submittedStaffId.length) {
                            location.path('/entercollectionsheet');
                        }


                    if (centerIdArray.length-1 === submittedStaffId.length) {
                        scope.submitNextShow = false;
                        scope.submitShow = true;
                    }
                    for (var i = 0; i < centerIdArray.length; i++) {
                        if (!scope.staffCenterData[i].submitted) {
                            scope.showPaymentDetails = false;
                            scope.paymentDetail.accountNumber = "";
                            scope.paymentDetail.checkNumber = "";
                            scope.paymentDetail.routingCode = "";
                            scope.paymentDetail.receiptNumber = "";
                            scope.paymentDetail.bankNumber = "";
                            scope.getAllGroupsByCenter(deepCopy(scope.staffCenterData[i].id), deepCopy(scope.staffCenterData[i].collectionMeetingCalendar.id));
                            break;
                        }
                    }
                    
                });


                }


            };
        }
    });
    mifosX.ng.application.controller('ProductiveCollectionSheetController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.ProductiveCollectionSheetController]).run(function ($log) {
        $log.info("ProductiveCollectionSheetController initialized");
    });
}(mifosX.controllers || {}));
