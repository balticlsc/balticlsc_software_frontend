import { mymixin } from '../../mixins/mixins.js'
import { _ } from 'vue-underscore'
import utils from '../../../utils/utils'
import blsc_axios from '../../../utils/axios'

export default {
    mixins:[mymixin, utils],
    mounted: function() {
        
        
        //var self = this;

        //const backend = this.SERVER_URL();
        const module_release_id = this.$route.params['id'];
        console.log(module_release_id);
        const body = {
            "onlyApps" : true,
        };

        blsc_axios.get(this.SERVER_URL() + "dev/release/?releaseUid=" + module_release_id)
        .then(response => {
            console.log("get response dev/release/list/", response);
            // response.data = _.map(response.data, function(id) {
            //                     return {id: id,
            //                             name: id,
            //                         };
            //                 });
            if (response.status == 200) {
                //this.authoredApplications.length = 0
                this.moduleRelease = response.data.data;
                // //self.authoredUnits = response.data.data;
                // for (let i = 0; i < response.data.data.length; i++) {
                //     let unit = response.data.data[i];
                //     unit._lastUpdateDate = new Date().toDateString()
                //     if (unit.uid === module_release_id) {
                //         this.moduleRelease = unit;
                //         // if( this.module.keywords == null){
                //         //     this.module.keywords = []
                //         // }
                //         if( this.moduleRelease.image == null){
                //             this.moduleRelease.image = ""
                //         }
                //         if( this.moduleRelease.command == null){
                //             this.moduleRelease.command = ""
                //         }

                        // this.cpu.range[0] = this.moduleRelease.supportedResourcesRange.minCPUs;
                        // this.cpu.range[1] = this.moduleRelease.supportedResourcesRange.maxCPUs;

                        // this.gpu.range[0] = this.moduleRelease.supportedResourcesRange.minGPUs;
                        // this.gpu.range[1] = this.moduleRelease.supportedResourcesRange.maxGPUs;

                        // this.memory.range[0] = this.moduleRelease.supportedResourcesRange.minMemory;
                        // this.memory.range[1] = this.moduleRelease.supportedResourcesRange.maxMemory;

                        // this.storage.range[0] = this.moduleRelease.supportedResourcesRange.minStorage;
                        // this.storage.range[1] = this.moduleRelease.supportedResourcesRange.maxStorage;

                //         break;
                //     }
                // }
                if(this.moduleRelease == null){
                    this.loaded = false;
                    console.log("Module release was not found.")
                }else{

                    this.cpu.range[0] = this.moduleRelease.supportedResourcesRange.minCPUs;
                    this.cpu.range[1] = this.moduleRelease.supportedResourcesRange.maxCPUs;

                    this.gpu.range[0] = this.moduleRelease.supportedResourcesRange.minGPUs;
                    this.gpu.range[1] = this.moduleRelease.supportedResourcesRange.maxGPUs;

                    this.memory.range[0] = this.moduleRelease.supportedResourcesRange.minMemory;
                    this.memory.range[1] = this.moduleRelease.supportedResourcesRange.maxMemory;

                    this.storage.range[0] = this.moduleRelease.supportedResourcesRange.minStorage;
                    this.storage.range[1] = this.moduleRelease.supportedResourcesRange.maxStorage;
                    
                    this.loaded = true;
                }
                
                
                // self.applications = _.map(self.applications, function(app) {
                //                         _.extend(app, {_lastUpdateDate: self.$moment(app.lastUpdateDate).format("YYYY-MM-DD"),})
                //                         return app;
                //                     });
            }
            else {
                console.error("Error", response);
            }
        });

        

        this.loadToolbox();
        this.loadTypes();
    },

    data: function() {
        return {
            moduleRelease: null,
            loaded: false,
            modulesInToolbox:[],
            isLoading:false,
            currentKeyword:"",
            currComandArgument:"",
            currService:"",

            dataTypes:[],
            dataStructures:[],
            accessTypes:[],

            selectedDataType: "",
            selectedDataStructure: "",
            selectedAccessType: "",

            cpu:{
                min:0,
                max:100,
                range:[0,10],
            },
            gpu:{
                min:0,
                max:100,
                range:[0,10],
            },
            memory:{
                min:0,
                max:100,
                range:[0,10],
            },
            storage:{
                min:0,
                max:100,
                range:[0,10],
            },

        }
    },

    methods: {
        processApp: function() {
            var self = this
            self.app.releases = _.sortBy(self.app.releases, function(release) {
                return -(new Date(release.date));
            });

            self.app.releases = _.map(self.app.releases, function(release, i) {

                var _available = "No";
                if (release.available) {
                    _available = "Yes";
                }

                var _private = "No";
                if (release.private) {
                    _private = "Yes";
                }

                var _openSource = "No";
                if (release.openSource) {
                    _openSource = "Yes";
                }

                var _isInstalled = self.myApps[release.uid]

                _.extend(release, {nr: i+1,
                                    _available: _available,
                                    _private: _private, 
                                    _openSource: _openSource,
                                    _isInstalled: _isInstalled
                                });

                return release;
            });       

            self.app._lastUpdateDate = self.app.releases[0].date;
        },

        installApp: function(ev) {
            var self = this;

            var backend = this.SERVER_URL();
            var release_id = $(ev.target).closest(".release").attr("id");

            axios.post(backend + "app/shelf/?releaseUid=" + release_id)
                .then(response => {
                    if (response.status == 200) {
                        self.myApps[release_id] = true;
                        self.processApp();
                    }
                    else {
                        console.error("Error", response);
                    }

                });
        },

        uninstallApp: function(ev) {
            var self = this;

            var backend = this.SERVER_URL();
            var release_id = $(ev.target).closest(".release").attr("id");

            axios.delete(backend + "app/shelf/?releaseUid=" + release_id)
                .then(response => {
                    if (response.status == 200) {
                        self.myApps[release_id] = false;
                        self.processApp();
                    }
                    else {
                        console.error("Error", response);
                    }

                });
        },
        MyencodedUri:function(file_content){
            let csvContent = "data:text;charset=utf-8," + file_content;
            var encodedUri = encodeURI(csvContent);
            return encodedUri
        },

        removeModuleReleaseFromToolbox:function(toolbox_item_uid){
            console.log("removeReleaseFromToolbox", toolbox_item_uid)
            
            
            // axios.delete(this.SERVER_URL() + "dev/toolbox/", {
            //     headers: {
            //         'Authorization': 'Bearer ' + this.validToken(),
            //         'Content-Type': 'application/json; charset=utf-8',
            //     },
            //     params:{
            //         releaseUid: toolbox_item_uid
            //     }
            // })
            blsc_axios.delete(this.SERVER_URL() + "dev/toolbox/", {
                params:{
                    releaseUid: toolbox_item_uid
                }
            })
            .then(response => {
                console.log("delete dev/toolbox response", response);
                // response.data = _.map(response.data, function(id) {
                //                     return {id: id,
                //                             name: id,
                //                         };
                //                 });
                if (response.status == 200 && response.data.success) {
                    //this.loadToolbox()
                    let ind_to_remove = -1
                    for(let i=0; i < this.modulesInToolbox.length; i++){
                        if( this.modulesInToolbox[i].uid == toolbox_item_uid){
                            ind_to_remove = i
                            break;
                        }
                    }
                    if( ind_to_remove != -1){
                        this.modulesInToolbox.splice(ind_to_remove,1)
                    }
                }
                else {
                    console.error("Error", response);
                }
            });
        },

        addModuleReleaseToToolbox:function(module_release_uid){
            this.isLoading = true;
            // axios.put(this.SERVER_URL() + "/dev/toolbox/",
            //     {
            //     },
            //     {
            //         params:{
            //             releaseUid: module_release_uid
            //         },
            //         headers:{
            //             'Authorization': 'Bearer ' + this.validToken(),
            //             'Content-Type' : 'application/json; charset=utf-8',
            //         } 
            //     }
            // )
            blsc_axios.put(this.SERVER_URL() + "/dev/toolbox/",
                {
                },
                {
                    params:{
                        releaseUid: module_release_uid
                    }
                }
            )
            .then(response => {
                    //console.log("post response", response);

                    if (response.status == 200 && response.data.success) {
                        //return;
                        //show messsage saying module added to toolbox
                        // this.statusMessage =  "Module release '"+lastRelease.uid+"'added to toolbox successfully"
                        // $('#alerts_success').show();
                        // this.loadAppsAndModules()
                        this.isLoading = false;
                        this.loadToolbox();
                    }
                    else {
                        console.error("Error", response);
                        
                        this.statusMessage =  "Module release addition to toolbox failed.\n" + response
                        $('#alerts_fail').show();
                    }
                    this.isLoading = false;
                    

            });
            
        },

        moduleReleaseIsInToolbox:function(module_release_uid){
            for(let i=0; i < this.modulesInToolbox.length; i++){
                if(this.modulesInToolbox[i].uid == module_release_uid){
                    return true;
                }
            }
            return false;
        },
        
        bindingKindString:function(val){
            val = val.toString();
            switch(val){
                case "0": return "Required-Strong";
                case "1": return "Required-Weak";
                case "2": return "Provided";
            }
            return "UnknownBinding " + val;
        },

        multiplicityKindString:function(val){
            val = val.toString();
            switch(val){
                case "0": return "Single";
                case "1": return "Multiple";
            }
            return "UnknownMultiplicity " + val;
            
        },
        
        getNameFromUid:function(array, elem_uid){
            if(array && elem_uid){
                for(let i=0; i < array.length; i++){
                    if(array[i].uid === elem_uid){
                        return array[i].name;
                    }
                }
            }
            return "";
        },

        getDataTypeNameById:function(dataTypeUid){
            return this.getNameFromUid(this.dataTypes,dataTypeUid);
        },

        getDataStructureNameById:function(dataStructureUid){
            return this.getNameFromUid(this.dataStructures, dataStructureUid);
        },

        getDataAccessTypeNameById:function(accessTypeUid){
            return this.getNameFromUid(this.accessTypes, accessTypeUid);
        },


        loadToolbox:function(){
            this.isLoading = true;
            // axios.get(this.SERVER_URL() + "dev/toolbox/", 
            // {
            //     headers: {
            //         'Authorization': 'Bearer ' + this.validToken(),
            //         'Content-Type': 'application/json; charset=utf-8',
            //     }
            // }
            // )
            blsc_axios.get(this.SERVER_URL() + "dev/toolbox/")
            .then(response => {
                console.log("get /dev/toolbox/", response);
                
                if ( response.status == 200 && response.data.success ) {
                    this.modulesInToolbox = response.data.data
                    
                }
                else {
                    console.error("Error", response);
                }
                this.isLoading=false;
            });
        },

        init_types_lists:function(response_dataTypes,response_accessTypes,response_dataStructures){
            var self = this;
            if (self.noErrorsInResponse(response_dataTypes) && 
                self.noErrorsInResponse(response_accessTypes) && 
                self.noErrorsInResponse(response_dataStructures)
            ) 
            {
              this.dataTypes = _.sortBy(_.map(response_dataTypes.data.data, function(dt) {
                return {
                  name: dt.name + " (" + dt.version + ")",
                  uid: dt.uid,
                  isStructured: dt.isStructured,
                }
              }), function(dt) {
                return dt.name
              });
          
              this.accessTypes = _.sortBy(_.map(response_accessTypes.data.data, function(at) {
                return {
                  name: at.name + " (" + at.version + ")",
                  uid: at.uid,
                }
              }), function(at) {
                return at.name
              });
              this.dataStructures = _.sortBy(response_dataStructures.data.data, function(ds) { return ds.name});
            }
        },

        loadTypes:function(){
            var self = this;
            this.isLoading = true;
            const backend = this.SERVER_URL();
            const request_datatypes = blsc_axios.get(backend + "task/dataTypes");
            const request_accesstypes = blsc_axios.get(backend + "task/accessTypes");
            const request_datastructures = blsc_axios.get(backend + "task/dataStructures");

            Promise
            .all([request_datatypes, request_accesstypes, request_datastructures])
            .then((responses) => {
                var responses_good = true;
                _.each(responses, function(resp) {
                    responses_good = self.noErrorsInResponse(resp) && responses_good
                });
                if (responses_good) {
                    self.init_types_lists( responses[0], responses[1], responses[2]);
                    self.isLoading = false;
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
                self.isLoading = false;
            });
    
        },
        
        updateModule(){
            console.log("um");
            let self = this;
            // const releaseDescription = {
            //     "name": this.module.name,
            //     "uid": this.module.uid,
            //     "pClass": this.module.pClass,
            //     "shortDescription": this.module.shortDescription,
            //     "longDescription": this.module.longDescription,
            //     "keywords": this.module.keywords,
            //     "icon": this.module.icon,
            // };
            console.log(this.moduleRelease.uid);
            const releaseDescription = {
                
                    "uid": this.moduleRelease.uid,
                    //"status": 0,
                    //"date": "2021-03-09T23:21:43.524Z",
                    
                    "openSource": this.moduleRelease.openSource,
                    //"usageCounter": 0,
                    // "version":this.moduleRelease.version,
                    // "description":this.moduleRelease.description,
                    "version":this.moduleRelease.version,
                    "description":this.moduleRelease.description,
                    // "pins": this.moduleRelease.pins,
                    "supportedResourcesRange": {
                      "minCPUs": this.cpu.range[0],
                      "minGPUs": this.gpu.range[0],
                      "minMemory": this.memory.range[0],
                      "minStorage": this.storage.range[0],
                      
                      "maxCPUs": this.cpu.range[1],
                      "maxGPUs": this.gpu.range[1],
                      "maxMemory": this.memory.range[1],
                      "maxStorage": this.storage.range[1]
                    },

                    //"image": this.moduleRelease.image,
                    //"command": this.moduleRelease.command,
                    //"commandArguments": this.moduleRelease.commandArguments,
                    //"variableMappings": this.moduleRelease.variableMappings,
                    //"requiredServices": this.moduleRelease.requiredServices,
            };

            blsc_axios.post(this.SERVER_URL() + "dev/appRelease/", releaseDescription)
            .then(response => {
                //console.log("get /dev/toolbox/", response);
                
                if ( response.status == 200 && response.data.success ) {
                    self.addNotification("App release " + self.moduleRelease.uid + " update succeeded.", "info");
                    self.$router.push('/development-shelf');
                }
                
            }).catch(error => {
                self.processErrorInPromise(error)
            });
        },

        addKeyword(){
            this.module.keywords.push(this.currentKeyword);
            this.currentKeyword='';
        },

        addCommandArgument(){
            this.moduleRelease.commandArguments.push(this.currComandArgument);
            this.currComandArgument = "";
        },
        
        addRequiredService(){
            this.moduleRelease.requiredServices.push(this.currService);
            this.currService = "";
        },

        setCreateDeclaredPinFormControlsToDefaultValues:function(){
            console.log("showAddPinModal")
             // console.log("prm",aaaa)
            // console.log("Button test")
            // console.log(event.target);
            // let apprel = document.getElementById("createAppRelease")//.modal('show');
            // console.log("apprel",apprel)
            // console.log(this.currAppId)
            //this.currAppId = app_uid
            //console.log(this.currAppId)
            //this.validateRelease = false
            //this.releaseName = ""

            document.getElementById("pin_name_id").value = ""
            let binding_elements = document.getElementsByName('binding');
            
            // console.log(binding_elements);
            // binding_elements.forEach(e => {
            //     e.checked = false
            // });
            binding_elements[0].checked = true;

            
            let multiplicity_elements = document.getElementsByName('multiplicity');
            
            // console.log(multiplicity_elements);
            // multiplicity_elements.forEach(e => {
            //     e.checked = false
            // });
            multiplicity_elements[0].checked = true;
            
            let data_multiplicity_elements = document.getElementsByName('dataMultiplicity');
            
            // console.log(multiplicity_elements);
            // multiplicity_elements.forEach(e => {
            //     e.checked = false
            // });
            data_multiplicity_elements[0].checked = true;

            this.selectedDataType = "";
            this.selectedAccessType = "";
            this.selectedDataStructure = "";
        },


        createDeclaredPin:function(){
            console.log("createDeclaredPin()")
            console.log()
            let name = document.getElementById("pin_name_id").value
            
            let binding = null
            let binding_elements = document.getElementsByName('binding');
            
            console.log(binding_elements);
            binding_elements.forEach(e => {
                if (e.checked) {
                    binding = e.value;
                }
            });
            
            let multiplicity = null
            let multiplicity_elements = document.getElementsByName('multiplicity');
            
            console.log(multiplicity_elements);
            multiplicity_elements.forEach(e => {
                if (e.checked) {
                    multiplicity = e.value;
                }
            });

            let dataMultiplicity = null
            let data_multiplicity_elements = document.getElementsByName('dataMultiplicity');
            
            console.log(data_multiplicity_elements);
            data_multiplicity_elements.forEach(e => {
                if (e.checked) {
                    dataMultiplicity = e.value;
                }
            });

            let new_pin = {
                name: name,
                binding: binding,
                tokenMultiplicity: multiplicity,
                dataMultiplicity: dataMultiplicity,

                dataTypeUid:this.selectedDataType,
                dataStructureUid:this.selectedDataStructure,
                accessTypeUid:this.selectedAccessType,
            }
            console.log(new_pin)
            this.moduleRelease.pins.push(new_pin)
            
            this.setCreateDeclaredPinFormControlsToDefaultValues();
            //hide form 
            $("#createDeclaredPin").modal('hide');
        },
        
        shouldDataStructureBeVisible(){
            //find datatype in a list of datatypes by selectedDataType; variable selectedDataType contains id of a datatType 
            let selectedDataType_loc = null;
            for(let i=0; i < this.dataTypes.length; i++){
                if(this.dataTypes[i].uid == this.selectedDataType ){
                    selectedDataType_loc = this.dataTypes[i];
                    break;
                }
            }
            //console.log("shouldDataStructureBeVisible returning " , selectedDataType_loc && selectedDataType_loc.isStructured)
            if(selectedDataType_loc && selectedDataType_loc.isStructured){
                return true;
            }else{
                //if the new data type is set to the one that is not structured data structure should not be visible 
                //and previsously selested value is set to ""
                this.selectedDataStructure = "";
                return false;
            }
            
        },

        createEnvVarMappingEntry(){
            console.log("createEnvVarMappingEntry()")
            
            let accCredName = document.getElementById("acc_cred_name_id").value;
            let defaultCredValue = document.getElementById("default_cred_value_id").value;
            let envVarName = document.getElementById("env_var_name_id").value;

            console.log(accCredName, defaultCredValue, envVarName)

            this.moduleRelease.variableMappings.push( {
                //accessVariableName:defaultVarValue,
                accessCredentialName:accCredName,
                //defaultVariableValue:envVarName,
                defaultCredentialValue:defaultCredValue,
                environmentVariableName:envVarName,
            });

            document.getElementById("acc_cred_name_id").value = "";
            document.getElementById("default_cred_value_id").value = "";
            document.getElementById("env_var_name_id").value = "";

            $("#createEnvVariable").modal('hide');
        },
    }
}
