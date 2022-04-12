import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
//import https from 'https'

import blsc_axios from '../../utils/axios'


import AddModuleRelease from './AddModuleRelease/AddModuleRelease.vue'
import PinTable from './../ComputationModule/PinTable/PinTable.vue'

export default {
    mixins:[mymixin, utils],
    components:{
        AddModuleRelease,
        PinTable,
    },

    mounted: function() {

        //var self = this;
        //var backend = this.SERVER_URL();
        let modal = document.getElementById("createAppRelease")
        console.log("modal mounted ", modal)
        this.showOnlyOwned = localStorage.getItem("DevShelfshowOnlyOwned")=="true" ? true : false; 

        // modal.'show.bs.modal' = function (event) {
        //     var button = event.relatedTarget // Button that triggered the modal
        //     console.log(button)
        //     // var recipient = button.data('whatever') // Extract info from data-* attributes
        //     // // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        //     // // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        //     // var modal = this
        //     // modal.find('.modal-title').text('New message to ' + recipient)
        //     // modal.find('.modal-body input').val(recipient)
        //   }

        // console.log(document.getElementById("modulesPill"))
        // document.getElementById("modulesPill").addEventListener('shown.bs.tab', function(e) {
        //     console.log('About to slide');
        // });

        

        // console.log(document.getElementById("applications"))
        // document.getElementById("applications").addEventListener('shown.bs.tab', function(e) {
        //     console.log('About to slide 1');
        // });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {//when clicking on pill, store the tab that we just visited (that just has been shown)
            //console.log(e.target.href);
            const lastActiveTab = $(e.target).text();
            //console.log(lastActiveTab);
            localStorage.setItem("lastActiveTab", lastActiveTab);
        })

        const lastActiveTab = localStorage.getItem("lastActiveTab");
        if(lastActiveTab != null){//activate tab that was last active
            if(lastActiveTab == "Modules"){
                document.getElementById("modulesPill").click();
            }
            if(lastActiveTab == "Application"){
                document.getElementById("applicationsPill").click();
            }
        }

        this.loadAppsAndModules();
    },

    data: function() {
        return {
            currApp : null,
            //currAppId: null,
            //applications: [],
            allApplications:[],
            authoredApplications: [],
            allModules:[],
            authoredModules: [],
            showOnlyOwned: false,
            modulesInToolbox: [],
            releaseName: "",
            validateRelease: false,

            validateModuleRelease: false,
            moduleReleaseName: "",
            moduleReleaseDescription: "",
            moduleYAMLContent: "",
            moduleReleaseImage: "",
            moduleReleasePins: [],
            moduleReleaseIsOpenSource:false,
            statusMessage: "",

            moduleRelease:{
                versionName: "",
                description: "",
                imageName: "",
                //pins:[],
            }

            

        };
    },
    computed:{
        appsToShow:function(){
            if(this.showOnlyOwned){
                return this.authoredApplications;
            }
            return this.allApplications;
        },
        
        modulesToShow:function(){
            if(this.showOnlyOwned){
                return this.authoredModules;
            }
            return this.allModules;
        }
    },

    watch: {
        showOnlyOwned: function(val) {
            localStorage.setItem("DevShelfshowOnlyOwned", val);
        }
    },

    methods: {
        deleteAppClicked(){
            console.log("deleteappclicked", this.currApp)
        },

        //add module to toolbox - add last release of this module to toolbox
        //remove module release from toolbox - remove all releases(not only the last) of this module from toolbox 
        //can add module to toolbox - if the last release is not present in toolbox -> true
        //can remove - at least one release of this module is in toolbox
        
        canAddModuleToToolBox(module){ //if unit is not service and the last release is not present in toolbox -> true 
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

        getModuleById(module_uid) {
            let currModule = null;
            for (let i = 0; i < this.allModules.length; i++) {
                if (this.allModules[i].uid == module_uid) {
                    currModule = this.allModules[i];
                }
            }
            return currModule;
        },

        getAppById(app_uid){
            let currModule = null;
            for (let i = 0; i < this.allApplications.length; i++) {
                if (this.allApplications[i].uid == app_uid) {
                    currModule = this.allApplications[i];
                }
            }
            return currModule;
        },

        getUnitById(unit_uid){
            let unit = this.getAppById(unit_uid);
            if(unit != null){
                return unit;
            }
            else{
                return this.getModuleById(unit_uid);
            }
        },
        
        addModuleToToolboxById:function(module_uid){
            //var self = this;
            //console.log("addModuleToToolbox " + module_uid );
            this.currModuleId = module_uid;
            let currModule = this.getModuleById(module_uid);
            this.addUnitToToolbox(currModule)
        },

        addAppToToolboxById:function(module_uid){
            //var self = this;
            this.currModuleId = module_uid;
            let currModule = this.getAppById(module_uid);
            this.addUnitToToolbox(currModule)
        },

        addUnitToToolbox:function(currModule){
            var self = this;
            
            this.currModuleId = currModule.uid;

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
                                this.loadAppsAndModules()
                            }
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

        removeModuleFromToolbox: function(module_uid){
            console.log("removeModuleFromToolbox " + module_uid );
            
            this.currModuleId = module_uid
            
            var self = this;
            let currModule = null
            
            //find module by uid
            for(let i=0; i < this.authoredModules.length; i++){
                if( this.authoredModules[i].uid == module_uid ){
                    currModule = this.authoredModules[i]
                }
            }
            
            if(currModule){
                const lastRelease = this.getLastRelease(currModule) 
                //console.log( "\tlastRelease", lastRelease )
                if(lastRelease){
                    //add module release to toolbox
                    // axios.delete(this.SERVER_URL() + "/dev/toolbox/",
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
                    blsc_axios.delete(this.SERVER_URL() + "/dev/toolbox/",
                        {
                            params:{
                                releaseUid: lastRelease.uid
                            }
                        }
                    )
                    .then(response => {
                            //console.log("post response", response);

                            if (self.noErrorsInResponse(response)) {
                                self.addNotification("Release '"+self.releaseUid+" 'removed from toolbox successfully!")
                                this.loadAppsAndModules()
                            }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });
                }else{
                    self.addNotification("Module "+currModule+" has no releases!", "error")
                }
            }else{
                //module not found ???
            }
        },
        

        showCreateAppReleaseModal:function(app_uid){
            // console.log("prm",aaaa)
            // console.log("Button test")
            // console.log(event.target);
            // let apprel = document.getElementById("createAppRelease")//.modal('show');
            // console.log("apprel",apprel)
            // console.log(this.currAppId)
            this.currAppId = app_uid
            //console.log(this.currAppId)
            this.validateRelease = false
            this.releaseName = ""
            $("#createAppRelease").modal('show')
        },

        showCreateModuleReleaseModal:function(module_uid){
            this.currModuleId = module_uid
            //console.log(this.currAppId)
            //console.log("this.validatModuleRelease " , this.validatModuleRelease );
            this.validateModuleRelease = false;
            //console.log("this.validatModuleRelease " , this.validatModuleRelease );
            this.moduleReleaseName = "";
            this.moduleReleaseDescription = "";
            this.moduleYAMLContent = "";
            this.moduleReleasePins = [];
            //set checkbox to null value 
            this.moduleReleaseIsOpenSource = false;
            $("#create-module-release").modal('show')
        },

        // eslint-disable-next-line no-unused-vars
        addDiagram: function(e) {
            var self = this;

            axios.post(self.SERVER_URL() + "editor/diagram", {name: "diagram1"})
                    .then(response => {
                        console.log("response ", response)
                        if (self.noErrorsInResponse(response)) {
                            var diagram_id = response.data;

                            self.applications.push({id: diagram_id, name: diagram_id,});
                            self.$router.push({name: "ComputationApplication", params: { applicationId: diagram_id}})
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });
        },

        createNewApplicationClicked:function(){
            var self = this;
            console.log("createNewApplicationClicked")
            let app_name = document.getElementById("application_name_id").value
            console.log(app_name)
            // axios.put(this.SERVER_URL() + "/dev/app/",
            //        {
            //            data:{

            //            },
            //        },
            //        {
            //             params:{
            //                 name: app_name
            //             },
            //             headers:{
            //                 'Authorization': 'Bearer ' + this.validToken(),
            //                 'Content-Type' : 'application/json; charset=utf-8',
            //             } 
            //         }
            // )
            blsc_axios.put(this.SERVER_URL() + "/dev/app/",
                   {
                       data:{

                       },
                   },
                   {
                        params:{
                            name: app_name
                        }
                    }
            )
            .then(response => {

                    console.log("post response", response);

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
                        this.loadAppsAndModules();
                        self.addNotification("Application "+app_name+" created. Click Edit diagram to start editing!")
                    }

                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        createNewModuleClicked:function(){
            var self = this;
            console.log("createNewModuleClicked")
            let module_name = document.getElementById("module_name_id").value
            console.log(module_name)
            // axios.put(this.SERVER_URL() + "/dev/module/",
            //        {
            //            data:{

            //            },
            //        },
            //        {
            //             params:{
            //                 name: module_name
            //             },
            //             headers:{
            //                 'Authorization': 'Bearer ' + this.validToken(),
            //                 'Content-Type' : 'application/json; charset=utf-8',
            //             } 
            //         }
            // )
            blsc_axios.put(this.SERVER_URL() + "/dev/module/",
                   {
                       data:{

                       },
                   },
                   {
                        params:{
                            name: module_name
                        }
                    }
            )
            .then(response => {

                    console.log("post response", response);

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
                        this.loadAppsAndModules();

                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        createAppReleaseClicked:function(event){
            var self = this;
            this.validateRelease = true
            $('#alerts_success').hide();
			$('#alerts_fail').hide();
            //console.log("createNewAppRelease")
            console.log("createAppReleaseClicked",event)
            //console.log("createAppReleaseClicked",event.relatedTarget)
            console.log("modal" , document.getElementById("createAppRelease"))

            //event.target.nodeName
            const version = document.getElementById("app_release_version_name_id").value

            if( ! version || ! version.trim() ){
                console.log("version is null")
                //alert("Enter non empty version!")

                //document.getElementById("app_release_version_name_id").classList.add("")
                return
            }
            this.validateRelease = false
            $('#createAppRelease').modal('hide');
            //console.log(module_name)
            // axios.put(this.SERVER_URL() + "dev/appRelease/",
            //        {
            //            data:{
            //            },
            //        },
            //        {
            //             params:{
            //                 version: version,
            //                 appUid:this.currAppId
            //             },
            //             headers:{
            //                 'Authorization': 'Bearer ' + this.validToken(),
            //                 'Content-Type' : 'application/json; charset=utf-8',
            //             } 
            //         }
            // )
            blsc_axios.put(this.SERVER_URL() + "dev/appRelease/",
                   {
                       data:{
                       },
                   },
                   {
                        params:{
                            version: version,
                            appUid:this.currAppId
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
                        this.addNotification("App release created successfully");
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        createModuleRelease:function(event){
            var self = this;
            //this.validateModuleRelease = true
            //console.log("createModuleReleaseClicked",event)
            //console.log("modal" , document.getElementById("createAppRelease"))

            //event.target.nodeName
            //const version = document.getElementById("module_release_version_name_id").value;

            //if( ! version || ! version.trim() ){//version must be non empty
                //console.log("version is null")
                //alert("Enter non empty version!")
            //    return;
            //}
            //this.validateModuleRelease = false;

            //$('#create-module-release').modal('hide');

            //const yaml = document.getElementById("yaml_txt_area").value;
            //const openSource = document.getElementById("isOpenSourceChk").checked;
            //console.log("opensource", openSource);
            //const description = document.getElementById("description_txt_area").value;

            //console.log(module_name)
            // axios.put(this.SERVER_URL() + "dev/appRelease/",
            //        {
            //            data:{
            //            },
            //        },
            //        {
            //             params:{
            //                 version: version,
            //                 appUid:this.currAppId
            //             },
            //             headers:{
            //                 'Authorization': 'Bearer ' + this.validToken(),
            //                 'Content-Type' : 'application/json; charset=utf-8',
            //             } 
            //         }
            // )
            blsc_axios.put(this.SERVER_URL() + "dev/moduleRelease/",
                   {
                       version: this.moduleRelease.versionName,
                       description: this.moduleRelease.description,
                       image: this.moduleRelease.imageName,
                       pins: this.$refs.pinsTable_1.pins,
                       //yaml: yaml,
                       //openSource: openSource,
                       

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
                            moduleUid:this.currModuleId
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
                        this.addNotification("Module release created successfully");
                    }                 
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
                //update local data
                this.moduleRelease.versionName = "";
                this.moduleRelease.description = "";
                this.moduleRelease.imageName = "";
                this.$refs.pinsTable_1.pins = [];
                
                $('#create-module-release').modal('toggle');//close modal

        },

        getDateOfLastUpdate:function(unit){
            let hasReleases = unit && 'releases' in unit && unit.releases && unit.releases.length > 0
            if( hasReleases ){
                let last_update_date = new Date(unit.releases[0].date)

                for(let i=0; i < unit.releases.length ; i++){
                    let release = unit.releases[i]
                    let currDateStr = release.date
                    let currDate = new Date(currDateStr)
                    // console.log("\trelease date ", currDate)
                    // console.log("\td ", new Date(currDate).toDateString() )
                    if( currDate > last_update_date ){
                        last_update_date = currDate
                    }
                }
                // console.log("last_update" , last_update_date)
                // console.log("\n")

                return last_update_date
            }
            //todays date
            return new Date()
        },

        removeModuleReleaseFromToolbox:function(toolbox_item_uid){
            var self = this;
            console.log("removeReleaseFromToolbox", toolbox_item_uid)

            self.clearModalMessage();
            
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
                if (self.noErrorsInResponse(response, true)) {
                    self.showModalMessage("Unit release "+toolbox_item_uid+" removed from toolbox","info")
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
            })
            .catch(error => {
                self.processErrorInPromise(error, true)
            });
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

        showAddPinModal:function(){
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

            var inner_modal = $("#createDeclaredPin");
            //inner_modal.modal('show');
            inner_modal.modal({backdrop: "static"});

            var $m1 = $('#createModuleRelease');
            //var $innermodal = $m1.find(".modal");     //get reference to nested modal
            $m1.after(inner_modal);                  // snatch it out of inner modal and put it after.
            
            
        },

        bindingKindString:function(val){
            switch(val){
                case "0": return "Required-Weak";
                case "1": return "Required-Strong";
                case "2": return "Provided";
            }
            return "UnknownBinding " + val;
        },

        multiplicityKindString:function(val){
            switch(val){
                case "0": return "Single";
                case "1": return "Multiple";
            }
            return "UnknownMultiplicity " + val;
            
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
            }
            console.log(new_pin)
            this.moduleReleasePins.push(new_pin)
            //hide form 
            $("#createDeclaredPin").modal('hide');
        },

        deleteComputationUnit: function(unitId) {
            var self = this;

            blsc_axios.delete(self.SERVER_URL() + "dev/unit/?unitUid=" + unitId)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                      self.addNotification("Unit " + self.currApp.uid + " delete succeeded.", "info");
                      self.loadAppsAndModules();
                      
                        // self.$router.push({name: "ComputationApplications"});
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        loadAppsAndModules:function () {
            var self = this;
            const body = {
                //"onlyApps" : true //atlasam visu ieks then skirojam kas ir modulis, kas ir app; skirosana vajadziga jo backends neapstrada onlyapps:false
                "allUnits": true,
            };
            // axios.post(this.SERVER_URL() + "dev/unit/list/", body, {
            //     headers: {
            //         'Authorization': 'Bearer ' + this.validToken(),
            //         'Content-Type': 'application/json; charset=utf-8',
            //     }
            // })
            //blsc_axios.post(this.SERVER_URL() + "dev/unit/list/", body)
            blsc_axios.get(this.SERVER_URL() + "dev/shelf")
            .then(response => {
                console.log("post response", response);
                // response.data = _.map(response.data, function(id) {
                //                     return {id: id,
                //                             name: id,
                //                         };
                //                 });
                if (self.noErrorsInResponse(response)) {
                    this.authoredApplications.length = 0
                    this.authoredModules.length = 0
                    //self.authoredUnits = response.data.data;
                    for (let i = 0; i < response.data.data.length; i++) {
                        let unit = response.data.data[i];
                        //unit._lastUpdateDate = new Date().toDateString()
                        unit._lastUpdateDate = this.getDateOfLastUpdate(unit).toDateString()
                        if (unit.isApp == true) {
                            this.authoredApplications.push(unit);
                        }
                        else {
                            this.authoredModules.push(unit);
                        }
                    }
                    // self.applications = _.map(self.applications, function(app) {
                    //                         _.extend(app, {_lastUpdateDate: self.$moment(app.lastUpdateDate).format("YYYY-MM-DD"),})
                    //                         return app;
                    //                     });
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
            });

            // axios.post(this.SERVER_URL() + "app/list/", body, {
            //     headers: {
            //         'Authorization': 'Bearer ' + this.validToken(),
            //         'Content-Type': 'application/json; charset=utf-8',
            //     }
            // })
            blsc_axios.post(this.SERVER_URL() + "dev/unit/list/", body)
            //blsc_axios.get(this.SERVER_URL() + "app/shelf/")
            .then(response => {
                console.log("post app list response", response);
                // response.data = _.map(response.data, function(id) {
                //                     return {id: id,
                //                             name: id,
                //                         };
                //                 });
                if (self.noErrorsInResponse(response)) {
                    this.allApplications.length = 0;
                    this.allModules.length = 0;
                    //this.authoredModules.length = 0
                    //self.authoredUnits = response.data.data;
                    for (let i = 0; i < response.data.data.length; i++) {
                        let unit = response.data.data[i];
                        //unit._lastUpdateDate = new Date().toDateString()
                        let lastUpd = this.getDateOfLastUpdate(unit)
                        //console.log("deb " ,  lastUpd)
                        unit._lastUpdateDate = lastUpd.toDateString()
                        if (unit.isApp == true) {
                            this.allApplications.push(unit);
                        }
                        else {
                            this.allModules.push(unit);
                        }
                    }
                    
                    // self.applications = _.map(self.applications, function(app) {
                    //                         _.extend(app, {_lastUpdateDate: self.$moment(app.lastUpdateDate).format("YYYY-MM-DD"),})
                    //                         return app;
                    //                     });
                }
                else {
                    console.error("Error", response);
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
            });

            // axios.get(this.SERVER_URL() + "dev/toolbox/", 
            //     {
            //         headers: {
            //             'Authorization': 'Bearer ' + this.validToken(),
            //             'Content-Type': 'application/json; charset=utf-8',
            //         }
            //     }
            // )
            blsc_axios.get(this.SERVER_URL() + "dev/toolbox/")
            .then(response => {
                console.log("get /dev/toolbox/", response);
                // response.data = _.map(response.data, function(id) {
                //                     return {id: id,
                //                             name: id,
                //                         };
                //                 });
                if (self.noErrorsInResponse(response)) {
                    this.modulesInToolbox = response.data.data
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
            });
        },

        isAppOwnedByCurrentUser(app){
            for(let i=0; i < this.authoredApplications.length; i++){
                if (this.authoredApplications[i].uid == app.uid){
                    return true;
                }
            }
            
            return false;
        },
        isModuleOwnedByCurrentUser(module){
            for(let i=0; i < this.authoredModules.length; i++){
                if (this.authoredModules[i].uid == module.uid){
                    return true;
                }
            }
            
            return false;
        },
        isUnitDeprecated: function(unit) {
            return _.every(unit.releases, function(release) { return release.status == 3});
        },
        isReleaseDeprecated: function(release) {
            return release.status == 3;
        },
    },
}




