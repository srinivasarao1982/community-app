(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCenterController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.managecode = routeParams.managecode;
            scope.first = {};
            scope.first.date = new Date();
            scope.centerId = routeParams.id;
            scope.restrictDate = new Date();
            scope.editcentertypes=false;
            scope.iscbcheckrequireds=false;
            scope.iscbchecks=false;
            scope.grtchecked=false;


            resourceFactory.centerResource.get({centerId: routeParams.id, template: 'true',staffInSelectedOfficeOnly:true}, function (data) {
                scope.edit = data;
                scope.staffs = data.staffOptions;
                if(data.isnewCenter=='New'){
                    scope.isnewcentes=true;
                    scope.editcentertypes=true;
                }
                if(data.iscbCheckRequired=='Yes'){
                    scope.iscbcheckrequireds=true;
                    scope.iscbcheckrequireds=true;
                }
               if(data.iscbchecked=='Yes'){
                   scope.iscbchecks=true;
               }
                if(data.isgrtCompleted=='Yes'){
                    scope.grtchecked=true;
                }

                scope.formData = {
                    name: data.name,
                    externalId: data.externalId,
                    staffId: data.staffId
                };

                if (data.activationDate) {
                    var newDate = dateFilter(data.activationDate, scope.df);
                    scope.first.date = new Date(newDate);
                }

                if (data.timeline.submittedOnDate) {
                    scope.mindate = new Date(data.timeline.submittedOnDate);
                }
            });

            scope.updateGroup = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.activationDate = reqDate;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if(angular.isUndefined(scope.formData.isnewCenter)){
                if(scope.formData.isnewCenter||scope.isnewcentes) {
                    this.formData.isnewCenter = 1;
                } }else {
                    if (scope.formData.isnewCenter) {
                        this.formData.isnewCenter = 1;

                    } else {
                        this.formData.isnewCenter = 0;
                    }
                }
                if(angular.isUndefined(scope.formData.iscbcheckRequired)){
                    if(scope.formData.iscbcheckRequired||scope.iscbcheckrequireds){
                        this.formData.iscbcheckRequired=1;
                }}else {
                    if (scope.formData.iscbcheckRequired ) {
                        this.formData.iscbcheckRequired = 1;
                    } else {
                        this.formData.iscbcheckRequired = 0;
                    }
                }
                if(angular.isUndefined(scope.formData.isgrtCompleted)){
                    if(scope.formData.isgrtCompleted||scope.isgrtCompleted){
                        this.formData.iscbcheckRequired=0;
                    }}else {
                    if (scope.formData.isgrtCompleted ) {
                        this.formData.isgrtCompleted = 1;
                    } else {
                        this.formData.isgrtCompleted = 0;
                    }
                }
                if(angular.isUndefined(scope.formData.iscbchecked)){
                    alert("test");
                    if(scope.formData.iscbchecked||scope.iscbchecked){
                        this.formData.iscbchecked=0;
                    }}else {
                    alert("this");
                    if (scope.formData.iscbchecked ) {
                        this.formData.iscbchecked = 1;
                    } else {
                        this.formData.iscbchecked = 0;
                    }
                    alert(this.formData.iscbchecked);
                }
                resourceFactory.centerResource.update({centerId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewcenter/' + routeParams.id);
                });
            };
            scope.activate = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                var newActivation = new Object();
                newActivation.activationDate = reqDate;
                newActivation.locale = scope.optlang.code;
                newActivation.dateFormat = scope.df;
                resourceFactory.centerResource.save({centerId: routeParams.id, command: 'activate'}, newActivation, function (data) {
                    location.path('/viewcenter/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditCenterController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditCenterController]).run(function ($log) {
        $log.info("EditCenterController initialized");
    });
}(mifosX.controllers || {}));