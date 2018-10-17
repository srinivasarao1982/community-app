(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblLoanController: function (scope, routeParams,resourceFactory, location, dateFilter) {


            scope.addedGroups = [];
            scope.pslcodeOptions =[{"id":1,"name":103},{"id":2,"name":104},{"id":3,"name":107},{"id":4,"name":108},{"id":5,"name":114},{"id":6,"name":125}];
            scope.topuploanflagOptions=[{"id":1,"name":"Normal Loan"},{"id":2,"name":"Top UpLoan"}];
            scope.hosiptalcashOptions=[{"id":1,"name":"310"},{"id":2,"name":"620"},{"id":3,"name":"0.0"}];
            scope.prepaidchargeOptions=[{"id":1,"name":"120"},{"id":2,"name":"0.0"}];


            scope.loanId=routeParams.loanId;

            scope.submit = function () {

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                for(var i=0;i<scope.hosiptalcashOptions.length;i++){
                   if(this.formData.hosiptalcash==scope.hosiptalcashOptions[i].id){
                       this.formData.hosiptalcash= scope.hosiptalcashOptions[i].name;
                   }
                }
                for(var i=0;i<scope.prepaidchargeOptions.length;i++){
                    if(this.formData.prpaidcharge==scope.prepaidchargeOptions[i].id){
                        this.formData.prpaidcharge=scope.prepaidchargeOptions[i].name;
                        break;
                    }
                }
                this.formData.loanId=routeParams.loanId;
                resourceFactory.rblloanresourceforSave.save(this.formData, function (data) {
                    location.path('/viewloanaccount/' + routeParams.loanId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblLoanController', ['$scope','$routeParams','ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblLoanController]).run(function ($log) {
        $log.info("CreateRblLoanController initialized");
    });
}(mifosX.controllers || {}));
