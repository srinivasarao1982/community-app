(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCenterController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.addedGroups = [];
            scope.rblOffice=[];
            resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true},function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.groups = data.groupMembersOptions;
                scope.formData.officeId = data.officeOptions[0].id;
            });
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:true,isSequenceNumber:false},function(data){
                scope.rblOffice=data.allowedParents;
            });
            resourceFactory.officeResource.getAllRblOffices({officeId:35,rbloffice:false,isSequenceNumber:true,entityId:3},function(data){
                scope.sequenceNumber=data.sequenceNo;
            });

            scope.changeOffice = function (officeId) {

                for(var i=0;i<scope.rblOffice.length;i++){
                    if(officeId==scope.rblOffice[i].id){
                        scope.formData.externalId= scope.sequenceNumber;
                        break;
                    }
                }
                resourceFactory.centerTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: scope.formData.officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                });
                resourceFactory.centerTemplateResource.get({officeId: scope.formData.officeId }, function (data) {
                    scope.groups = data.groupMembersOptions;
                });
            };
            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };

            scope.viewGroup = function (item) {
                scope.group = item;
            };

            scope.add = function () {
                if(scope.available != ""){
                    var temp = {};
                    temp.id = scope.available.id;
                    temp.name = scope.available.name;
                    scope.addedGroups.push(temp);
                }
            };

            scope.sub = function (id) {
                for (var i = 0; i < scope.addedGroups.length; i++) {
                    if (scope.addedGroups[i].id == id) {
                        scope.addedGroups.splice(i, 1);
                        break;
                    }
                }
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.activationDate = reqDate;

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                scope.formData.groupMembers = [];
                for (var i in scope.addedGroups) {
                    scope.formData.groupMembers[i] = scope.addedGroups[i].id;
                }
                this.formData.isnewCenter=1;
                if(scope.formData.iscbcheckRequired){
                    this.formData.iscbcheckRequired=1;
                }else{
                    this.formData.iscbcheckRequired=0;

                }
                if(scope.formData.iscbchecked){
                    this.formData.iscbchecked=1;
                }else{
                    this.formData.iscbchecked=0;

                }
                if(scope.formData.isgrtCompleted){
                    this.formData.isgrtCompleted=1;
                }else{
                    this.formData.isgrtCompleted=0;

                }
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.active = this.formData.active || false;
                resourceFactory.centerResource.save(this.formData, function (data) {
                    location.path('/viewcenter/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCenterController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateCenterController]).run(function ($log) {
        $log.info("CreateCenterController initialized");
    });
}(mifosX.controllers || {}));
