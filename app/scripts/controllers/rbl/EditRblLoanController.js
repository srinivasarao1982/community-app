(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRblLoanController: function (scope, resourceFactory,routeParams, location, dateFilter) {


            scope.formData = {};
            scope.restrictDate = new Date();
            scope.pslcodeOptions =[{"id":1,"name":103},{"id":2,"name":104},{"id":3,"name":107},{"id":4,"name":108},{"id":5,"name":114},{"id":6,"name":125}];
            scope.topuploanflagOptions=[{"id":1,"name":"Normal Loan"},{"id":2,"name":"Top UpLoan"}];
            scope.hosiptalcashOptions=[{"id":1,"name":"310"},{"id":2,"name":"620"},{"id":3,"name":"0.0"}];
            scope.prepaidchargeOptions=[{"id":1,"name":"120"},{"id":2,"name":"0.0"}];
            scope.loanId=routeParams.loanId;

            resourceFactory.rblloanresource.get({loanId:routeParams.loanId},function (data) {
                scope.formData=data;
                scope.id=data.id;
                for(var i=0;i<scope.hosiptalcashOptions.length;i++){
                    if(scope.formData.hosiptalCash==scope.hosiptalcashOptions[i].name){
                        scope.formData.hosiptalcash= scope.hosiptalcashOptions[i].id;
                        break;
                    }
                }
                for(var i=0;i<scope.prepaidchargeOptions.length;i++){
                    if(scope.formData.prpaidcharge==scope.prepaidchargeOptions[i].name){
                        scope.formData.prpaidcharge=scope.prepaidchargeOptions[i].id;
                        break;
                    }
                }
                for(var i=0;i<scope.pslcodeOptions.length;i++){
                    if(scope.formData.pslcode==scope.pslcodeOptions[i].id){
                        scope.formData.pslcode=scope.pslcodeOptions[i].id;
                        break;
                    }
                }
               // {"pslcode":1,"topUpflag":1,"hosiptalCash":"310","prpaidcharge":"120"}
                for(var i=0;i<scope.topuploanflagOptions.length;i++){
                    if(scope.formData.topUpflag==scope.topuploanflagOptions[i].id){
                        scope.formData.topuploanflag=scope.topuploanflagOptions[i].id;
                        break;
                    }
                }
            });
            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblloanresourceforUpdate.put({loanId:scope.loanId},this.formData, function (data) {
                    location.path('/viewloanaccount/' + scope.loanId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditRblLoanController', ['$scope', 'ResourceFactory','$routeParams', '$location', 'dateFilter', mifosX.controllers.EditRblLoanController]).run(function ($log) {
        $log.info("EditRblLoanController initialized");
    });
}(mifosX.controllers || {}));
