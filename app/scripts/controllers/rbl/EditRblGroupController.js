(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRblGroupController: function (scope,routeParams, resourceFactory, location, dateFilter) {


            scope.formData = {};
            scope.restrictDate = new Date();
            scope.groupTypeOptions =[{"id":1,"name":"SHG"},{"id":2,"name":"JLG"}];

            scope.groupId=routeParams.groupId;
            resourceFactory.rblgroupresource.get({groupId:routeParams.groupId},function (data) {
                scope.formData=data;
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                    scope.meetingTimeOptions = data.time;
                    for(var i=0;i<scope.meetingTimeOptions.length;i++){
                         alert(scope.formData.meetingTime);
                         alert("name"+scope.meetingTimeOptions[i].name);
                        if(scope.formData.meetingTime==scope.meetingTimeOptions[i].name){
                            scope.formData.meetingTime=scope.meetingTimeOptions[i].id;
                            break;
                        }
                    }

                });


                    });
            scope.submit = function () {

                for(var i=0;i<scope.meetingTimeOptions.length;i++){
                    if(this.formData.meetingTime==scope.meetingTimeOptions[i].id){
                        this.formData.meetingTime=scope.meetingTimeOptions[i].name;
                    }
                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.groupId=routeParams.groupId;
                alert(this.formData.groupId);
                resourceFactory.rblgroupresource.update({groupId:routeParams.groupId},this.formData, function (data) {
                    location.path('/viewgroup/' + routeParams.groupId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditRblGroupController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditRblGroupController]).run(function ($log) {
        $log.info("EditRblGroupController initialized");
    });
}(mifosX.controllers || {}));
