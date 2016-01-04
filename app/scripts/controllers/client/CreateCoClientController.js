(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateCoClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {

            scope.clientId = routeParams.id;
            scope.formData = {};
            scope.formData.clientId = routeParams.id;
            scope.formData.coClientData = [{}];
            scope.formData.naddress = [{}];
            scope.restrictDate=new Date();
            scope.formData.coClientData[0].age='';
            scope.selected = false;

            resourceFactory.coClientTemplateResource.get({}, function (coClientData) {
                scope.spouseRelationShip = coClientData.spouseRelationShip;
                scope.formData.coClientData[0].relationship=scope.spouseRelationShip[0].id;
                scope.districtOptins = coClientData.district;
                scope.stateOptions = coClientData.state;
                scope.formData.naddress[0].state=scope.stateOptions[0].id;
                scope.addressTypes = coClientData.addressTypes;

            });
            scope.$watch('formData.coClientData[0].dateOfBirth',function(){
                scope.AgeCalculate();
            });
            scope.AgeCalculate = function(){
                scope.birthDate=[];
                scope.todayDates=[];
                scope.date=dateFilter(this.formData.coClientData[0].dateOfBirth, 'dd-MM-yyyy');
                var today= dateFilter(new Date(),'dd-MM-yyyy');
                scope.birthDate=scope.date.split('-');
                scope.todayDates=today.split('-');
                var age = scope.todayDates[2]-scope.birthDate[2];
                var m = scope.todayDates[1] - scope.birthDate[1];
                if (m < 0 || (m === 0 && scope.todayDates[0] < scope.birthDate[0])) {
                    age--;
                }
                scope.formData.coClientData[0].age=age;
            }


            scope.$watch('autofillHolder',function(){

                if(scope.autofillHolder!=''&&scope.autofillHolder!=null) {
                    scope.selected = true;
                    scope.selected1 =false;
                }
            });
            scope.isDatafilled = false;
            scope.autoFill = function (){

                if(scope.autofillHolder.length > 25){
                    if(window.DOMParser){
                        parser = new DOMParser();
                    }
                    else{
                        alert("Browser not supported!");
                        return null;
                    }

                    xmlDoc = parser.parseFromString(scope.autofillHolder, 'text/xml');
                    var barCodedData = xmlDoc.getElementsByTagName("PrintLetterBarcodeData");
                    if(barCodedData != undefined && barCodedData != null  && barCodedData != "" ){
                        var barCodedDataObject = barCodedData[0];

                    //    scope.formData.clientExt.aadhaarNo = barCodedDataObject.getAttribute("uid");
                        // Name derived
                        var fullName = barCodedDataObject.getAttribute("name").toUpperCase();
                        var names = fullName.split(" ");
                        var isFirstNameDerived = false;
                        var isMidNameDerived = false;
                        var isLastNameDerived = false;
                        var fistName = "";
                        var midName = "";
                        var lastName = "";

                        // Need to improve the name splitting logic for all scenarios

                        if(names.length == 2)
                        {
                            isMidNameDerived = true;
                        }


                        for (var i = 0; i < names.length; i++) {

                            if(!isFirstNameDerived)
                            {
                                fistName =  names[i];
                                isFirstNameDerived=true;
                            }else if(!isMidNameDerived)
                            {
                                midName =  names[i];
                                isMidNameDerived =  true;
                            }else{
                                lastName = lastName + names[i];
                            }

                        }
                        scope.formData.coClientData[0].firstName = fistName;
                        scope.formData.coClientData[0].middleName = midName;
                        scope.formData.coClientData[0].lastName = lastName;

                        // Spouse or fother name derived

                        var gname = barCodedDataObject.getAttribute("gname");
                        if(gname!=null && gname!=undefined && gname!=""){
                            scope.formData.coClientData[0].fatherFirstName=gname.toUpperCase();;
                        }

                        var co = barCodedDataObject.getAttribute("co");
                        if(co!=null) {
                            co = co.toUpperCase();
                            var cos = co.split(" ");
                            var iscoFirstNameDerived = false;
                            var iscoMidNameDerived = false;
                            var iscoLastNameDerived = false;
                            var cofistName = "";
                            var comidName = "";
                            var colastName = "";
                            var startCos = 0;


                            if (co.indexOf("/") > -1) {
                                startCos = 1;
                            }
                            ;


                            if (cos.length == 3) {
                                iscoMidNameDerived = true;
                            } else if (cos.length == 1) {
                                startCos = 0;
                            }

                            // Need to improve the name splitting logic for all scenarios
                            for (var i = startCos; i < cos.length; i++) {
                                if (!iscoFirstNameDerived) {

                                    if ((cos[i].toLowerCase().indexOf("late") > -1 && cos[i].length <= 6 ) || cos[i].length <= 2) {
                                        cofistName = cofistName + " " + cos[i];
                                    } else {
                                        cofistName = cofistName + " " + cos[i];
                                        iscoFirstNameDerived = true;
                                    }


                                } else if (!iscoMidNameDerived) {
                                    comidName = cos[i];
                                    iscoMidNameDerived = true;
                                } else {
                                    colastName = colastName + cos[i];
                                }

                            }

                            scope.formData.coClientData[0].fatherFirstName = cofistName;
                            scope.formData.coClientData[0].fatherMiddleName = comidName;
                            scope.formData.coClientData[0].fatherLastName = colastName;

                        }
                        // date of birth derived
                        var dob =  barCodedDataObject.getAttribute("dob");

                        if(dob != undefined && dob != null  && dob != "" ){
                            var dates = dob.split("/");
                            if(dates.length<2){
                                var dates = dob.split("-");
                                scope.formData.coClientData[0].dateOfBirth = new Date(dates[0],dates[1]-1,dates[2]);
                            }
                            else {
                                scope.formData.coClientData[0].dateOfBirth = new Date(dates[2], dates[1] - 1, dates[0]);
                            }
                        }else{
                            var yob =  barCodedDataObject.getAttribute("yob");
                            scope.formData.coClientData[0].dateOfBirth = new Date(yob,6,1);
                        }



                        // Address details

                        var houseNo =  barCodedDataObject.getAttribute("house");
                        var street =  barCodedDataObject.getAttribute("street");
                        var loc =  barCodedDataObject.getAttribute("loc");
                        var vtc =  barCodedDataObject.getAttribute("vtc");
                        var po =  barCodedDataObject.getAttribute("po");
                        var dist =  barCodedDataObject.getAttribute("dist");
                        var subdist =  barCodedDataObject.getAttribute("subdist");
                        var state =  barCodedDataObject.getAttribute("state");
                        var pc =  barCodedDataObject.getAttribute("pc");

                        if(houseNo != undefined && houseNo != null){
                            scope.formData.naddress[0].houseNo = houseNo.toUpperCase();
                        }

                        if(street != undefined && street != null){
                            scope.formData.naddress[0].streetNo = street.toUpperCase();
                        }

                        if(loc != undefined && loc != null){
                            scope.formData.naddress[0].areaLocality = loc.toUpperCase();
                        }

                        if(po != undefined && po != null){
                            scope.formData.naddress[0].landmark = po.toUpperCase();
                        }

                        if(vtc != undefined && vtc != null){
                            scope.formData.naddress[0].villageTown = vtc.toUpperCase();
                        }

                        if(pc != undefined && pc != null){
                            scope.formData.naddress[0].pinCode = pc.toUpperCase();
                        }

                        if(subdist != undefined && subdist != null){
                            scope.formData.naddress[0].taluka = subdist.toUpperCase();
                        }


                        if( dist != undefined && dist != null ){
                            var distObj =  _.find(scope.districtOptins, function(item) {return item.name.toLowerCase() == dist.toLowerCase();});

                            if(distObj != undefined && distObj != null ) {
                                scope.formData.naddress[0].district = distObj.id;
                            }

                        }


                        if( state != undefined && state != null ){
                            var stateObj =  _.find(scope.stateOptions, function(item) {return item.name.toLowerCase() == state.toLowerCase();});
                            if( stateObj != undefined && stateObj != null ){
                                scope.formData.naddress[0].state = stateObj.id;
                            }

                        }





                        scope.addressabove = true;
                        scope.isDatafilled = true;
                        scope.autofillHolder = "";
                        scope.selected1 =true;
                        scope.selected=false;

                    }
                    else{
                        alert("Invalid read! Please read again.");
                    }

                }
                else{
                    alert("Invalid read! Please read again.");
                }

            };



            scope.issave = false;
            scope.submitAndAccept = function () {
                scope.issave = true;
                if(this.formData.coClientData){
                    for(var i = 0; i < this.formData.coClientData.length; i++){
                        if(this.formData.coClientData[i].relationship){
                            this.formData.coClientData[i].clientId = scope.formData.clientId;
                            if (scope.formData.coClientData[i].dateOfBirth) {
                                this.formData.coClientData[i].dateOfBirth = dateFilter(scope.formData.coClientData[i].dateOfBirth, scope.df);
                            }
                            this.formData.coClientData[i].locale = scope.optlang.code;
                            this.formData.coClientData[i].dateFormat = scope.df;
                        }
                    }
                }

                if(this.formData.naddress){
                    for(var i in scope.addressTypes){
                        if(scope.addressTypes[i].name == 'Spouse Address'){
                            this.formData.naddress[0].addressType = scope.addressTypes[i].id;
                            break;
                        }
                    }
                    for(var i = 0; i < this.formData.naddress.length; i++){
                        this.formData.naddress[i].locale = scope.optlang.code;
                        this.formData.naddress[i].dateFormat = scope.df;
                    }
                }

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                resourceFactory.coClientResource.save(this.formData, function (data) {
                    scope.issave = false;
                    location.path('/viewclient/' + scope.formData.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateCoClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateCoClientController]).run(function ($log) {
        $log.info("CreateCoClientController initialized");
    });
}(mifosX.controllers || {}));