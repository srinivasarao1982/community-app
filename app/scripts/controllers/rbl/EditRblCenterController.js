(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRblCenterController: function (scope,routeParams, resourceFactory, location, dateFilter) {

            scope.formData = {};
            scope.restrictDate = new Date();
            scope.addedGroups = [];

            var requestParams = {staffInSelectedOfficeOnly: true};
            requestParams.officeId = 1;
            scope.meetingTimeOptions=[];
            scope.centerId=routeParams.centerId;

            resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                scope.meetingTimeOptions = data.time;
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                    scope.meetingTimeOptions = data.time;
                    for(var i=0;i<scope.meetingTimeOptions.length;i++){
                        if(scope.formData.meetingTime==scope.meetingTimeOptions[i].name){
                            scope.formData.meetingTime=scope.meetingTimeOptions[i].id;
                            break;
                        }
                    }

                });

            });

                resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
            });
            resourceFactory.rblcenterresource.get({centerId:routeParams.centerId}, function (data) {
                scope.formData=data;


                    for(var i =0;i< scope.meetingTimeOptions.length;i++){
                        if(data.meetingTime==scope.meetingTimeOptions[i].name){
                            scope.formData.meetingTime= scope.meetingTimeOptions[i].id;
                            break;
                        }
                    }
            });
            scope.submit = function () {

                for(var i=0;i<scope.meetingTimeOptions.length;i++){
                    if(this.formData.meetingTime==scope.meetingTimeOptions[i].id){
                        this.formData.meetingTime=scope.meetingTimeOptions[i].name;
                    }
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.active = this.formData.active || false;
                resourceFactory.rblcenterresource.update({centerId:routeParams.centerId},this.formData, function (data) {
                    location.path('/viewcenter/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditRblCenterController', ['$scope','$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditRblCenterController]).run(function ($log) {
        $log.info("EditRblCenterController initialized");
    });
}(mifosX.controllers || {}));
