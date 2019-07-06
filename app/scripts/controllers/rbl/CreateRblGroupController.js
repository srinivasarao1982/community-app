(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblGroupController: function (scope, routeParams,resourceFactory, location, dateFilter) {

            //scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.groupTypeOptions =[{"id":1,"name":"SHG"},{"id":2,"name":"JLG"}];
            scope.meetingTimeOptions=[];
            scope.groupId=routeParams.groupId;

            resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                scope.meetingTimeOptions = data.time;

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
                resourceFactory.rblgroupresourceforsave.save(this.formData, function (data) {
                    location.path('/viewgroup/' +routeParams.groupId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblGroupController', ['$scope','$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblGroupController]).run(function ($log) {
        $log.info("CreateRblGroupController initialized");
    });
}(mifosX.controllers || {}));
