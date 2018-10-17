(function (module) {
    mifosX.controllers = _.extend(module, {
        RblValidationSearchController: function (scope, routeParams, resourceFactory, dateFilter, location) {
            var params = {};
            params.locale = scope.optlang.code;
            params.dateFormat = scope.df;
            scope.formData={};
            scope.requestvalue=true;
            var param={};
            scope.formData.valufor='CB';
            scope.requestvalue=true;
            scope.fileData=[];

            scope.valueFor=function(val){
                this.formData.fileType=val;
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
                if (scope.formData.fromDate) {
                    this.formData.fromDate = dateFilter(scope.formData.fromDate, 'yyyy-MM-dd');
                }

                if (scope.formData.toDate) {
                    this.formData.toDate = dateFilter(scope.formData.toDate,'yyyy-MM-dd');
                }
                if(scope.formData.valufor=='CB'){
                    scope.requestvalue=false;
                }
                if(scope.formData.valufor=='RBL'){
                    scope.requestvalue=true;
                }
                resourceFactory.rblvalidationresourceforValidate.get( scope.formData,function(data){
                    scope.fileData=data;
                })
            }

        }
    });
    mifosX.ng.application.controller('RblValidationSearchController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$location', mifosX.controllers.RblValidationSearchController]).run(function ($log) {
        $log.info("RblValidationSearchController initialized");
    });
}(mifosX.controllers || {}));
