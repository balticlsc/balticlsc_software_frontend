import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore'
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'

import PinTable from './PinTable/PinTable.vue'

export default {
    
    components: {
        PinTable,
    },
    
    mixins:[mymixin, utils],
    mounted: function() {
        var self = this;

        //const backend = this.SERVER_URL();
        this.loadModule();

        //get authoredUnits
        blsc_axios.get(this.SERVER_URL() + "dev/shelf")
            .then(response => {
                //console.log("post response", response);
                
                if (self.noErrorsInResponse(response)){
                    this.authoredUnits = response.data.data;
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
            });

        this.loadToolbox();
    },

    data: function() {
        return {
            module: null,
            loaded: false,
            modulesInToolbox:[],
            isLoading:false,
            authoredUnits:[],
            // app:{
            //     memory:{
            //         range:[10,140]
            //     },
            //     CPU:{
            //         range:[1,32]
            //     },
            //     GPU:{
            //         range:[1,20]
            //     },
            //     storage:{
            //         range:[1,100]
            //     }
            // },
            minMaxRanges:{
                memory:[0,100],
                CPU:[0,100],
                GPU:[0,100],
                storage:[0,100]
            },
            currRelease:null,
            versionName:"",
            description:"",
            imageName:"",
            // command:"",
            releaseSortOrder:"Date",

            pins:[],

            dataTypes:[],
            dataStructures:[],
            accessTypes:[],

            selectedDataType: "",
            selectedDataStructure: "",
            selectedAccessType: "",
        }
    },

    methods: {
        
        loadModule() {
            const module_id = this.$route.params['moduleId']

            const body = {
                //"onlyApps" : true //atlasam visu ieks then skirojam kas ir modulis, kas ir app; skirosana vajadziga jo backends neapstrada onlyapps:false
            }

            // axios.post(this.SERVER_URL() + "dev/unit/list/", body, {
            //     headers: {
            //         'Authorization': 'Bearer ' + this.validToken(),
            //         'Content-Type': 'application/json; charset=utf-8',
            //     }
            // })
            blsc_axios.post(this.SERVER_URL() + "dev/unit/list/", body)
                .then(response => {
                    console.log("post response dev/unit/list/", response)
                    // response.data = _.map(response.data, function(id) {
                    //                     return {id: id,
                    //                             name: id,
                    //                         };
                    //                 });
                    if (response.status == 200) {
                        //this.authoredApplications.length = 0
                        this.module = null
                        //self.authoredUnits = response.data.data;
                        for (let i = 0; i < response.data.data.length; i++) {
                            let unit = response.data.data[i]
                            unit._lastUpdateDate = new Date().toDateString()
                            if (unit.uid === module_id) {
                                this.module = unit
                                this.processModule()
                                break
                            }
                        }
                        this.loaded = true
                        // self.applications = _.map(self.applications, function(app) {
                        //                         _.extend(app, {_lastUpdateDate: self.$moment(app.lastUpdateDate).format("YYYY-MM-DD"),})
                        //                         return app;
                        //                     });
                    }
                    else {
                        console.error("Error", response)
                    }
                });
        },


        processModule(){
            if(this.module){
                for (let i = 0; i < this.module.releases.length; i++){
                    let release = this.module.releases[i];
                    //console.log(release.supportedResourcesRange.minStorage, release.supportedResourcesRange.maxStorage)
                    release._supportedResourcesRange = {
                        CPU:[release.supportedResourcesRange.minCPUs, release.supportedResourcesRange.maxCPUs],
                        GPU:[release.supportedResourcesRange.minGPUs, release.supportedResourcesRange.maxGPUs],
                        memory:[release.supportedResourcesRange.minMemory, release.supportedResourcesRange.maxMemory],
                        storage:[release.supportedResourcesRange.minStorage, release.supportedResourcesRange.maxStorage],
                    };
                    // console.log(release.supportedResourcesRange.minStorage, release.supportedResourcesRange.maxStorage)
                    // console.log(release._supportedResourcesRange , release.supportedResourcesRange);
                    // console.log(release.supportedResourcesRange.minStorage, release.supportedResourcesRange.maxStorage)

                }
            }
        },

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
                case "3": return "ProvidedExternal";
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

        deleteModule:function(){
            console.log("delete module");
            let self = this;

            blsc_axios.delete(this.SERVER_URL() + 'dev/unit/', {
                    params: {
                        unitUid: this.module.uid,
                    }
                })
                .then(function(response) {
                    self.addNotification("Module " + self.module.uid + " delete succeeded.", "info");
                    self.$router.push('/development-shelf');
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },
        //copied from ComputationsApplications.js !!!
        isUnitOwnedByCurrentUser(unit){
            for(let i=0; i < this.authoredUnits.length; i++){
                if (this.authoredUnits[i].uid == unit.uid){
                    return true;
                }
            }
            
            return false;
        },

        ComputationUnitStatus(unitStatusID){
            let res = "Unknown unit status";
            switch(unitStatusID){
                case 0: res = "Created"; break;
                case 1: res = "Submitted"; break;
                case 2: res = "Approved"; break;
                case 3: res = "Discontinued"; break; 
            }
            return res;
        },

        deleteModuleRelease(){
            console.log("delete module release " , this.currRelease.uid);
            
            let self = this;

            blsc_axios.delete(this.SERVER_URL() + 'dev/release/', {
                    params: {
                        releaseUid : this.currRelease.uid,
                    }
                })
                .then(function(response) {
                    self.addNotification("Module release " + self.currRelease.uid + " deleted successfully.", "info");
                    //remove deleted release from list of releases 
                    for(let i=0; i < self.module.releases.length; i++){
                        let curr_local_release = self.module.releases[i];
                        if(curr_local_release.uid == self.currRelease.uid){
                            self.module.releases.splice(i,1);
                            break;
                        }
                    }
                    
                    self.currRelease = null;

                    //self.$router.push('/development-shelf');
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
            
        },

        createModuleRelease(){
            console.log("createModuleRelease " + this.versionName + " " + this.description );

            //console.log(this.$refs.pinsTable_1);
            //console.log(this.$refs.pinsTable_1.pins);

            
            //send post
            let self = this;
            blsc_axios.put(this.SERVER_URL() + "dev/moduleRelease/",
                   {
                       version: this.versionName,
                       pins: this.$refs.pinsTable_1.pins,
                       yaml: "",
                       openSource: true,
                       description: this.description,
                       image: this.imageName,
                       command: "",

                       "commandArguments": [],
                       "variableMappings": [],
                       "requiredServices": [],
                    //"uid": "string",
                    //"status": 0,
                    //"date": "2020-11-19T18:55:16.121Z",
                    
                    
                    //"usageCounter": 0,
                    // "pins": [
                    //   {
                    //     "uid": "string",
                    //     "name": "string",
                    //     "binding": 0,
                    //     "multiplicity": 0,
                    //     "dataType": "string",
                    //     "accessType": "string"
                    //   },
                    //   {
                    //     "uid": "pin_uid_1",
                    //     "name": "pin name",
                    //     "binding": 0,
                    //     "multiplicity": 0,
                    //     "dataType": "data type 1",
                    //     "accessType": "access type 1"
                    //   },
                    // ],
                    //"yaml": "yaml string"
                       
                   },
                   {
                        params:{
                            moduleUid: this.module.uid
                        }
                    }
            )
            .then(response => {

                    console.log("put response", response);

                    // response.data = _.map(response.data, function(id) {
                    //                     return {id: id,
                    //                             name: id,
                    //                         };
                    //                 });

                     if (self.noErrorsInResponse(response)) {
                    //     //self.authoredUnits = response.data.data;
                    //     for(let i=0; i < response.data.data.length; i++){
                    //         let unit = response.data.data[i]
                    //         if(unit.isApp == true){
                    //             self.authoredApplications.push(unit)
                    //         }else{
                    //             self.authoredModules.push(unit)
                    //         }
                            

                        //}

                        // self.applications = _.map(self.applications, function(app) {
                        //                         _.extend(app, {_lastUpdateDate: self.$moment(app.lastUpdateDate).format("YYYY-MM-DD"),})
                        //                         return app;
                        //                     });
                        //this.loadAppsAndModules();
                        //$("#createAppRelease .close").click()
                        console.log("Module release created successfully.")
                        this.addNotification("Module release created successfully.");
                        
                        self.loadModule();
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
            //update local data
            this.versionName = "";
            this.description = "";
            this.imageName = "";
            this.$refs.pinsTable_1.pins = [];
            console.log( this.pins );
            this.pins.length = 0; //remove all elements from pins array
            console.log( this.pins );
            $('#create-module-release').modal('toggle');//close modal

        },
        sortOrderChanged:function(newReleaseSortOrder){
            //console.log("a",newReleaseSortOrder);
            this.releaseSortOrder = newReleaseSortOrder;
        },

        canAddModuleToToolBox(module){ //if the last release is not present in toolbox -> true
            let lastRelease = this.getLastRelease(module)
            if( !module.isService && lastRelease ){
                for(let i=0; i < this.modulesInToolbox.length; i++){
                    if(this.modulesInToolbox[i].uid == lastRelease.uid){
                        return false;
                    }
                }
                return true;
            }
            return false;
        },

        canRemoveUnitFromToolbox:function(module){//if at least one release of this module is in the toolbox -> true
            for(let i=0; i < this.modulesInToolbox.length; i++){
                if(this.modulesInToolbox[i].unit.uid == module.uid){
                    return true;
                }
            }
            return false;
        },

        getLastRelease:function(unit){
            let hasReleases = unit && 'releases' in unit && unit.releases && unit.releases.length > 0
            if( hasReleases ){
                //let last_update_date = new Date(unit.releases[0].date)
                let latestRelease = unit.releases[0];
                for(let i=0; i < unit.releases.length ; i++){
                    let release = unit.releases[i]
                    let currDateStr = release.date
                    let currDate = new Date(currDateStr)
                    // console.log("\trelease date ", currDate)
                    // console.log("\td ", new Date(currDate).toDateString() )
                    if( currDate > new Date(latestRelease.date) ){
                        latestRelease = release
                    }
                }
                // console.log("last_update" , last_update_date)
                // console.log("\n")

                return latestRelease
            }
            return null
        },
        
        removeAllUnitReleasesFromToolbox:function(unit){
            var self = this;
            console.log("addModuleToToolbox " + unit.uid );
            this.currModuleId = unit.uid;
            
            //if this module has releases
            //remove all releases from toolbox
            //otherwise do nothing for now; later add functionality to create new module release
            // let currModule = null
            
            // //find module by uid
            // for(let i=0; i < this.allModules.length; i++){
            //     if( this.allModules[i].uid == unit_uid ){
            //         currModule = this.allModules[i]
            //     }
            // }
            if( ! unit ){
                return;
            }

            let releasesToRemove = []

            for(let i=0; i < this.modulesInToolbox.length;i++){
                let release = this.modulesInToolbox[i]
                if(release.unit.uid == unit.uid){
                    releasesToRemove.push(release)
                }
            }

            //console.log("releasestoremove",releasesToRemove)

            const delete_requests = []

            for(let i=0; i < releasesToRemove.length;i++){
                let delete_request = 
                // axios.delete(this.SERVER_URL() + "/dev/toolbox/",
                //     {
                //         params:{
                //             releaseUid: releasesToRemove[i].uid
                //         },
                //         headers:{
                //             'Authorization': 'Bearer ' + this.validToken(),
                //             'Content-Type' : 'application/json; charset=utf-8',
                //         } 
                //     }
                // )
                blsc_axios.delete(this.SERVER_URL() + "/dev/toolbox/",
                    {
                        params:{
                            releaseUid: releasesToRemove[i].uid
                        } 
                    }
                )
                delete_requests.push(delete_request)
            }

            Promise
                .all(delete_requests)
                .then((responses) => {
                    let allResponsesOk = true
                    _.forEach(responses, function(response) {
                        allResponsesOk = allResponsesOk && self.noErrorsInResponse(response);
                    })
                    if( allResponsesOk ){
                        //show messsage saying module removed from toolbox
                        self.addNotification("Releases of '"+unit.uid+" 'removed from toolbox successfully!")
                        
                        for(let i=0; i < releasesToRemove.length;i++){
                            let release = releasesToRemove[i]
                            //remove release from toolbox
                            let ind_to_remove = -1
                            for(let i=0; i < this.modulesInToolbox.length; i++){
                                if( this.modulesInToolbox[i].uid == release.uid){
                                    ind_to_remove = i
                                    break;
                                }
                            }
                            if( ind_to_remove != -1){
                                this.modulesInToolbox.splice(ind_to_remove,1)
                            }
                        }
                    } else {
                        this.addNotification("Could not remove all releases from toolbox!")
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                })
            
        },

        addUnitToToolbox:function(currModule){
            var self = this;
            
            //this.currModuleId = currModule.uid;

            //if this module has releases
            //add last release to the toolbox
            //otherwise do nothing for now; later add functionality to create new module release
            
            if(currModule){
                console.log("currModule ", currModule)
                const lastRelease = this.getLastRelease(currModule) 
                //console.log( "\tlastRelease", lastRelease )
                if(lastRelease){
                    //add module release to toolbox
                    // axios.put(this.SERVER_URL() + "/dev/toolbox/",
                    //     {
                    //     },
                    //     {
                    //         params:{
                    //             releaseUid: lastRelease.uid
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
                                releaseUid: lastRelease.uid
                            } 
                        }
                    )
                    .then(response => {
                            //console.log("post response", response);

                            if (self.noErrorsInResponse(response)) {
                                //reload data or just add id of last release to modulesInToolbox
                                //TODO : instead of loadAppsAndModules, loadModule, loadToolbox, load ...
                                this.isLoading = false;
                                this.loadToolbox();

                                //this.loadAppsAndModules()
                            }
                            this.isLoading = false;
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });
                }else{
                    self.addNotification("No release found for module " + this.currModuleId, "error");
                }
            }else{
                //module not found ???
            }
        },

        isUnitDeprecated: function(unit) {
            return _.every(unit.releases, function(release) { return release.status == 3});
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

    shouldDataStructureBeVisible:function(){
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
        this.pins.push(new_pin)
        
        this.setCreateDeclaredPinFormControlsToDefaultValues();
        //hide form 
        $("#createDeclaredPin").modal('hide');
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
    },
    

    computed:{
        orderedReleases:function(){
            function compareByDate(a, b) {
                console.log("sorting by date");
                var adate = Date.parse(a.date);
                var bdate = Date.parse(b.date);
                if (adate < bdate)
                  return -1;
                if (adate > bdate)
                  return 1;
                return 0;
            }

            function compareByVersion(a, b) {
                console.log("sorting by version");
                if (a.version < b.version)
                  return -1;
                if (a.version > b.version)
                  return 1;
                return 0;
            }
            

            return this.module.releases.sort(this.releaseSortOrder == "Date" ? compareByDate : compareByVersion);
        }
    }
    
}
