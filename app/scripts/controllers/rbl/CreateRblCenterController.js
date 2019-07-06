(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblCenterController: function (scope,routeParams, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.formData = {};
            scope.restrictDate = new Date();
            var requestParams = {staffInSelectedOfficeOnly: true};
            requestParams.officeId = 1;

            scope.meetingTimeOptions=[];

            resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                scope.meetingTimeOptions = data.time;

            });
            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
            });


            scope.submit = function () {

                for(var i=0;i<scope.meetingTimeOptions.length;i++){
                    if(this.formData.meetingTime==scope.meetingTimeOptions[i].id){
                        this.formData.meetingTime=scope.meetingTimeOptions[i].name;
                    }
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.centerId =routeParams.centerId;
                resourceFactory.rblcenterresourceforsave.save(this.formData, function (data) {
                    location.path('/viewcenter/' +routeParams.centerId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblCenterController', ['$scope','$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblCenterController]).run(function ($log) {
        $log.info("CreateRblCenterController initialized");
    });
}(mifosX.controllers || {}));
