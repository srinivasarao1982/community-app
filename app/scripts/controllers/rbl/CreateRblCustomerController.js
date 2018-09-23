(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblCustomerController: function (scope,routeParams, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.addedGroups = [];
            scope.healthOptions=[{"id":1,"name":"Normal"},{"id":2,"name":"Partial sa"},{"id":3,"name":"Physically Challenged"},{"id":4,"name":"Mentally Challenged"},{"id":5,"name":"gir"},{"id":6,"name":"Blind"},{"id":7,"name":"One"}];
            scope.languageOptions=[{"id":"kn-IN","name": "Kannada"},{"id":"hi-IN","name": "Hindi" },{"id":"or-IN" ,"name": "Oriya" },{"id":"en-US","name": "English"},{"id":"mr-IN" ,"name": "Marathi"},{"id":"ml-IN","name": "Malayalam"},{"id":"sn-IN","name": "Sanskrit"},{"id":"ta-IN","name": "Tamil"},{"id":"sn-IN" ,"name": "Sanskrit"},
                {"id":"bn-IN","name": "Bengali"},{"id":"or-IN" ,"name": "Oriya"}, {"id":"ud-IN" ,"name": "Urdu"}, {"id":"gg-IN" ,"name": "Gujrati"}, {"id":"en-OT" ,"name": "Others"}];
            scope.mothertoungOptions=[{"id":"kn-IN","name": "Kannada"},{"id":"hi-IN","name": "Hindi" },{"id":"or-IN" ,"name": "Oriya" },{"id":"en-US","name": "English"},{"id":"mr-IN" ,"name": "Marathi"},{"id":"ml-IN","name": "Malayalam"},{"id":"sn-IN","name": "Sanskrit"},{"id":"ta-IN","name": "Tamil"},{"id":"sn-IN" ,"name": "Sanskrit"},
                {"id":"bn-IN","name": "Bengali"},{"id":"or-IN" ,"name": "Oriya"}, {"id":"ud-IN" ,"name": "Urdu"}, {"id":"gg-IN" ,"name": "Gujrati"}, {"id":"en-OT" ,"name": "Others"}];

            scope.caedissueflagOptions =[{"id":0,"name":"False"},{"id":1,"name":"True"}];
            scope.cbchckOptions =[{"id":0,"name":"Yes"},{"id":1,"name":"No"}];
            scope.renwalflagOptions=[{"id":0,"name":"No"},{"id":1,"name":"Yes"}];
            scope.adharseedingconstantOptions =[{"id":1,"name":"Yes"},{"id":2,"name":"No"}];
            scope.gurdiangenderOptions=[{"id":0,"name":"Male"},{"id":1,"name":"Female"},{"id":2,"name":"Others"},{"id":3,"name":"Transgender"}];
            var requestParams = {staffInSelectedOfficeOnly: true};
                requestParams.officeId = 1;

            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
                scope.gurdianTitleOptions = clientData.salutation;
                scope.gurdianrelationOptions = clientData.familyrelationShip;

            });


            scope.submit = function () {
                alert(this.formData.health);
                alert(this.formData.language);
                alert(scope.formData.gurdiandateofBirth);
                if (scope.formData.gurdiandateofBirth) {
                    this.formData.gurdiandateofBirth = dateFilter(scope.formData.gurdiandateofBirth, scope.df);
                }
                if (scope.formData.spousedateofbIrt) {
                    this.formData.spousedateofbIrt = dateFilter(scope.formData.spousedateofbIrt, scope.df);
                }
                this.formData.clientId=routeParams.clientId;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblcustomerresource.save(this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblCustomerController', ['$scope', '$routeParams','ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblCustomerController]).run(function ($log) {
        $log.info("CreateRblCustomerController initialized");
    });
}(mifosX.controllers || {}));
