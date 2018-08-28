(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateRblCustomerController: function (scope, resourceFactory, location, dateFilter) {
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
            scope.languageOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.languageOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.mothertoungOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.caedissueflagOptions =[{"id":0,"name":"False"},{"id":1,"name":"True"}];
            scope.cbchckOptions =[{"id":0,"name":"Yes"},{"id":1,"name":"No"}];
            scope.renwalflagOptions=[{"id":0,"name":"No"},{"id":1,"name":"Yes"}];
            scope.gurdiangenderOptions=[{"id":0,"name":"Male"},{"id":1,"name":"Female"},{"id":0,"name":"Others"},{"id":1,"name":"Transgender"}];
            var requestParams = {staffInSelectedOfficeOnly: true};
                requestParams.officeId = 1;

            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
            });


            scope.submit = function () {
                if (scope.formData.gurdiandateofBirth) {
                    this.formData.submittedOnDate = dateFilter(scope.formData.gurdiandateofBirth, scope.df);;
                }
                if (scope.formData.spousedateofbIrt) {
                    this.formData.spousedateofbIrt = dateFilter(scope.formData.spousedateofbIrt, scope.df);;
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblcustomerresource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblCustomerController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblCustomerController]).run(function ($log) {
        $log.info("CreateRblCustomerController initialized");
    });
}(mifosX.controllers || {}));
