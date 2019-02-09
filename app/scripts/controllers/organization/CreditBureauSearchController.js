(function (module) {
    mifosX.controllers = _.extend(module, {
        CreditBureauSearchController: function (scope, routeParams, resourceFactory, dateFilter, location) {
            var params = {};
            params.locale = scope.optlang.code;
            params.dateFormat = scope.df;
            scope.formData={};
            scope.requestvalue=true;
            var param={};
            scope.formData.valufor='request';
            scope.requestvalue=true;
            scope.creditBureauResults=[];

            scope.valueFor=function(val){
                this.formData.valufor=val;
            }
            scope.rblOffice=[];
            scope.showDetails=false;
            scope.staffCenterData=[];
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                scope.rblOffice=data.allowedParents;
            });
            scope.changeOffice=function(officeId){
                var params = {};
                params.officeId = officeId;
                resourceFactory.centerResource.getAllMeetingFallCenters(params, function (data) {
                    scope.staffCenterData = data;//[0].meetingFallCenters;

                })
            }

            scope.submit=function() {
                scope.isfromDate =false;
                scope.isTodate=false;
                scope.dateError=false;
                if (scope.formData.fromDate) {
                    this.formData.fromDate = dateFilter(scope.formData.fromDate, 'yyyy-MM-dd');
                    scope.isfromDate=true;
                }

                if (scope.formData.toDate) {
                    this.formData.toDate = dateFilter(scope.formData.toDate,'yyyy-MM-dd');
                    scope.isTodate=true;
                }
                if(scope.formData.valufor=='response'){
                    scope.requestvalue=false;
                }
                if(scope.formData.valufor=='Error'){
                    scope.requestvalue=true;
                }
                if( scope.isfromDate && scope.isTodate) {
                    resourceFactory.equifaxcreditbureausearchresource.get(scope.formData, function (data) {
                        scope.creditBureauResults = data;
                    })
                }else{
                    scope.dateError=true;
                }
            }

        }
    });
    mifosX.ng.application.controller('CreditBureauSearchController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.CreditBureauSearchController]).run(function ($log) {
        $log.info("CreditBureauSearchController initialized");
    });
}(mifosX.controllers || {}));
