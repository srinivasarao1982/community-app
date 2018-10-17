(function (module) {
    mifosX.controllers = _.extend(module, {
        EditRblCustomerController: function (scope, routeParams,resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.staffs = [];
            scope.data = {};
            scope.first = {};
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.first.date = new Date();
            scope.addedGroups = [];
            scope.healthOptions=[{"id":"01","name":"Normal"},{"id":"02","name":"Partial sa"},{"id":"03","name":"Physically Challenged"},{"id":"04","name":"Mentally Challenged"},{"id":"05","name":"gir"},{"id":"06","name":"Blind"},{"id":"07","name":"One"}];
            scope.languageOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.languageOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.mothertoungOptions=[{"kn-IN" :1,"name": "Kannada"},{"hi-IN" :2,"name": "Hindi" },{"or-IN" :3,"name": "Oriya" },{"en-US" :4,"name": "English"},{"mr-IN" :5,"name": "Marathi"},{"ml-IN":6,"name": "Malayalam"},{"sn-IN" :7,"name": "Sanskrit"},{"ta-IN" :8,"name": "Tamil"},{"sn-IN" :9,"name": "Sanskrit"},
                {"bn-IN" :10,"name": "Bengali"},{"or-IN" :11,"name": "Oriya"}, {"ud-IN" :12,"name": "Urdu"}, {"gg-IN" :12,"name": "Gujrati"}, {"en-OT" :14,"name": "Others"}];
            scope.caedissueflagOptions =[{"id":0,"name":"False"},{"id":1,"name":"True"}];
            scope.cbchckOptions =[{"id":0,"name":"Yes"},{"id":1,"name":"No"}];
            scope.renwalflagOptions=[{"id":0,"name":"No"},{"id":1,"name":"Yes"}];
           // scope.gurdiangenderOptions=[{"id":1,"name":"Male"},{"id":2,"name":"Female"},{"id":3,"name":"Others"},{"id":4,"name":"Transgender"}];
            scope.languageOptions=[{"id":"kn-IN","name": "Kannada"},{"id":"hi-IN","name": "Hindi" },{"id":"or-IN" ,"name": "Oriya" },{"id":"en-US","name": "English"},{"id":"mr-IN" ,"name": "Marathi"},{"id":"ml-IN","name": "Malayalam"},{"id":"sn-IN","name": "Sanskrit"},{"id":"ta-IN","name": "Tamil"},{"id":"sn-IN" ,"name": "Sanskrit"},
                {"id":"bn-IN","name": "Bengali"},{"id":"or-IN" ,"name": "Oriya"}, {"id":"ud-IN" ,"name": "Urdu"}, {"id":"gg-IN" ,"name": "Gujrati"}, {"id":"en-OT" ,"name": "Others"}];
            scope.mothertoungOptions=[{"id":"kn-IN","name": "Kannada"},{"id":"hi-IN","name": "Hindi" },{"id":"or-IN" ,"name": "Oriya" },{"id":"en-US","name": "English"},{"id":"mr-IN" ,"name": "Marathi"},{"id":"ml-IN","name": "Malayalam"},{"id":"sn-IN","name": "Sanskrit"},{"id":"ta-IN","name": "Tamil"},{"id":"sn-IN" ,"name": "Sanskrit"},
                {"id":"bn-IN","name": "Bengali"},{"id":"or-IN" ,"name": "Oriya"}, {"id":"ud-IN" ,"name": "Urdu"}, {"id":"gg-IN" ,"name": "Gujrati"}, {"id":"en-OT" ,"name": "Others"}];
            scope.adharseedingconstantOptions =[{"id":"01","name":"Yes"},{"id":"02","name":"No"}];

            var requestParams = {staffInSelectedOfficeOnly: true};
            requestParams.officeId = 1;

            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
                scope.gurdianTitleOptions = clientData.gurdianTitle;
                scope.gurdianrelationOptions = clientData.gurdianRelation;
                scope.gurdiangenderOptions=clientData.clientBasicDetails.genderOptions;

            });

            resourceFactory.rblcustomerresource.get({customerId:routeParams.clientId}, function (clientData) {


                scope.formData=clientData;

                resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                    scope.gurdianTitleOptions = clientData.gurdianTitle;
                    scope.gurdianrelationOptions = clientData.gurdianRelation;



                    if (clientData.gurdiandateofBirth) {

                        var dobDate = dateFilter(clientData.gurdiandateofBirth, scope.df);
                        this.formData.gurdiandateofBirth = new Date(dobDate);
                    }
                    if (clientData.spousedateofbIrt) {
                        var dobDate = dateFilter(clientData.spousedateofbIrt, scope.df);
                        this.formData.spousedateofbIrt = new Date(dobDate);
                    }

                    for (var i = 0; i < scope.gurdianTitleOptions.length; i++) {
                        if (clientData.gurdianTitle == scope.gurdianTitleOptions[i].codescore) {
                            this.formData.gurdianTitle = scope.gurdianTitleOptions[i].id;
                            break;
                        }
                    }
                    for (var i = 0; i < scope.gurdianrelationOptions.length; i++) {
                        if (clientData.relation == scope.gurdianrelationOptions[i].codescore) {
                            this.formData.gurdianrelation = scope.gurdianrelationOptions[i].id;
                            break;
                        }
                    }
                    for (var i = 0; i < scope.gurdianTitleOptions.length; i++) {

                        if (scope.formData.gurdianTitle == scope.gurdianTitleOptions[i].codescore) {
                            scope.formData.gurdianTitle = scope.gurdianTitleOptions[i].id;
                            break;
                        }
                    }
                    for (var i = 0; i < scope.gurdianrelationOptions.length; i++) {
                        if (scope.formData.relation == scope.gurdianrelationOptions[i].codescore) {
                            scope.formData.relation = scope.gurdianrelationOptions[i].id;
                            break;
                        }
                    }
                });
            });


            scope.submit = function () {
                if (scope.formData.gurdiandateofBirth) {
                    this.formData.gurdiandateofBirth = dateFilter(scope.formData.gurdiandateofBirth, scope.df);;
                }
                if (scope.formData.spousedateofbIrt) {
                    this.formData.spousedateofbIrt = dateFilter(scope.formData.spousedateofbIrt, scope.df);;
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblcustomerresource.update({customerId:routeParams.clientId},this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditRblCustomerController', ['$scope', '$routeParams','ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditRblCustomerController]).run(function ($log) {
        $log.info("EditRblCustomerController initialized");
    });
}(mifosX.controllers || {}));
