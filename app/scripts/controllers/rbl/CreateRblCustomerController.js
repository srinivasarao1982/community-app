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
            scope.healthOptions=[{"id":"01","name":"Normal"},{"id":"02","name":"Partial sa"},{"id":"03","name":"Physically Challenged"},{"id":"04","name":"Mentally Challenged"},{"id":"05","name":"gir"},{"id":"06","name":"Blind"},{"id":"07","name":"One"}];
            scope.languageOptions=[{"id":"kn-IN","name": "Kannada"},{"id":"hi-IN","name": "Hindi" },{"id":"or-IN" ,"name": "Oriya" },{"id":"en-US","name": "English"},{"id":"mr-IN" ,"name": "Marathi"},{"id":"ml-IN","name": "Malayalam"},{"id":"sn-IN","name": "Sanskrit"},{"id":"ta-IN","name": "Tamil"},{"id":"sn-IN" ,"name": "Sanskrit"},
                {"id":"bn-IN","name": "Bengali"},{"id":"or-IN" ,"name": "Oriya"}, {"id":"ud-IN" ,"name": "Urdu"}, {"id":"gg-IN" ,"name": "Gujrati"}, {"id":"en-OT" ,"name": "Others"}];
            scope.mothertoungOptions=[{"id":"kn-IN","name": "Kannada"},{"id":"hi-IN","name": "Hindi" },{"id":"or-IN" ,"name": "Oriya" },{"id":"en-US","name": "English"},{"id":"mr-IN" ,"name": "Marathi"},{"id":"ml-IN","name": "Malayalam"},{"id":"sn-IN","name": "Sanskrit"},{"id":"ta-IN","name": "Tamil"},{"id":"sn-IN" ,"name": "Sanskrit"},
                {"id":"bn-IN","name": "Bengali"},{"id":"or-IN" ,"name": "Oriya"}, {"id":"ud-IN" ,"name": "Urdu"}, {"id":"gg-IN" ,"name": "Gujrati"}, {"id":"en-OT" ,"name": "Others"}];

            scope.caedissueflagOptions =[{"id":0,"name":"False"},{"id":1,"name":"True"}];
            scope.cbchckOptions =[{"id":0,"name":"Yes"},{"id":1,"name":"No"}];
            scope.renwalflagOptions=[{"id":0,"name":"No"},{"id":1,"name":"Yes"}];
            scope.adharseedingconstantOptions =[{"id":"01","name":"Yes"},{"id":"02","name":"No"}];
            //scope.gurdiangenderOptions=[{"id":1,"name":"Male"},{"id":2,"name":"Female"},{"id":3,"name":"Others"},{"id":4,"name":"Transgender"}];
            var requestParams = {staffInSelectedOfficeOnly: true};
                requestParams.officeId = 1;
            //scope.genderOptions = data.genderOptions;

            resourceFactory.clientTemplateResource.get(requestParams, function (clientData) {
                scope.districtOptins = clientData.district;
                scope.stateOptions = clientData.state;
                scope.gurdianTitleOptions = clientData.gurdianTitle;
                scope.gurdianrelationOptions = clientData.gurdianRelation;
                scope.gurdiangenderOptions=clientData.clientBasicDetails.genderOptions;

            });

            scope.cancel =function(){
                location.path('/viewclient/' + routeParams.clientId);
            }
            scope.submit = function () {

                if (scope.formData.gurdiandateofBirth) {
                    this.formData.gurdiandateofBirth = dateFilter(scope.formData.gurdiandateofBirth, scope.df);
                }
                if (scope.formData.spousedateofbIrt) {
                    this.formData.spousedateofbIrt = dateFilter(scope.formData.spousedateofbIrt, scope.df);
                }
                this.formData.clientId=routeParams.clientId;
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                resourceFactory.rblcustomerresourceforsave.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                   // scope.cancel();
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateRblCustomerController', ['$scope', '$routeParams','ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateRblCustomerController]).run(function ($log) {
        $log.info("CreateRblCustomerController initialized");
    });
}(mifosX.controllers || {}));
