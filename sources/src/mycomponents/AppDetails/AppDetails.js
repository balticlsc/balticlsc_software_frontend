import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore'
import utils from '../../utils/utils'
import axios from '../../utils/axios'

export default {
    mixins:[mymixin, utils],
    mounted: function() {
        this.loadData();
    },

    data: function() {
        return {
            isLoading:false,
            currRelease:null,
            app: {},
            myApps: [],
            unitsInToolbox:[],
            authoredUnits:[],

            releaseName: "",
            validateRelease: false,
        }
    },

    methods: {
        loadData:function() {
            var self = this;

            const backend = this.SERVER_URL();
            const app_id = this.$route.params['id'];
            
            const app_request = axios.get(backend + "app",
            {
                params: {
                    appUid: app_id
                }
            });
    
            const shelf_request =  axios.get(backend + "app/shelf");
            
            const toolbox_request = axios.get(backend + "dev/toolbox/");
            const authored_apps_request = axios.get(backend + "dev/shelf");
    
            // jasanem authored applications = 
            // get dev/shelf
            // jasanem toolbox - get /dev/toolbox
            Promise
                .all([app_request, shelf_request, toolbox_request, authored_apps_request])
                .then((responses) => {
                        const app_response = responses[0];
                        const shelf_response = responses[1];
                        const toolbox_response = responses[2];
                        const authored_response = responses[3];
                        
                        if (self.noErrorsInResponse(app_response) && self.noErrorsInResponse(shelf_response) 
                            && self.noErrorsInResponse(toolbox_response) && self.noErrorsInResponse(authored_response)) 
                        {
                            self.myApps = self.processResponse(shelf_response).data;
                            self.myApps = _.groupBy(self.myApps, function(myapp) {
                                return myapp.uid
                            });
                            self.app = app_response.data.data;
                            self.processApp();
                            self.unitsInToolbox = toolbox_response.data.data;
                            self.authoredUnits = authored_response.data.data;
    
                        }
                    })

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

            if (self.app.releases[0]) { self.app._lastUpdateDate = self.app.releases[0].date }
        },

        installApp: function(ev) {
            var self = this;

            var backend = this.SERVER_URL();
            var release_id = $(ev.target).closest(".release").attr("id");

            axios.post(backend + "app/shelf/?releaseUid=" + release_id)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                        self.myApps[release_id] = true;
                        self.addNotification("App release "+release_id+" added to cockpit!")
                        self.processApp();
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        uninstallApp: function(ev) {
            var self = this;

            var backend = this.SERVER_URL();
            var release_id = $(ev.target).closest(".release").attr("id");

            axios.delete(backend + "app/shelf/?releaseUid=" + release_id)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                        self.myApps[release_id] = false;
                        self.addNotification("App release "+release_id+" removed from cockpit!")
                        self.processApp();
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },
        
        deleteModule:function(){
            console.log("delete module");
            let self = this;

            axios.delete(this.SERVER_URL() + 'dev/unit/', {
                    params: {
                        unitUid: this.app.uid,
                    }
                })
                .then(function(response) {
                    self.addNotification("App " + self.app.uid + " delete succeeded.", "info");
                    self.$router.push('/development-shelf');
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        deleteModuleRelease(){
            console.log("delete app release " , this.currRelease.uid);
            
            let self = this;

            axios.delete(this.SERVER_URL() + 'dev/release/', {
                    params: {
                        releaseUid : this.currRelease.uid,
                    }
                })
                .then(function(response) {
                    self.addNotification("App release " + self.currRelease.uid + " deleted successfully.", "info");
                    //remove deleted release from list of releases 
                    for(let i=0; i < self.app.releases.length; i++){
                        let curr_local_release = self.app.releases[i];
                        if(curr_local_release.uid == self.currRelease.uid){
                            self.app.releases.splice(i,1);
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

        isAppReleaseInToolbox:function(release){
            for(let i=0; i < this.unitsInToolbox.length; i++){
                if(this.unitsInToolbox[i].uid == release.uid && this.unitsInToolbox[i].unit.uid == this.app.uid){
                    return true;
                }
            }
            return false;
        },

        removeAppReleaseFromToolbox:function(release){
            let toolbox_item_uid = release.uid;
            var self = this;
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
            axios.delete(this.SERVER_URL() + "dev/toolbox/", {
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
                    for(let i=0; i < this.unitsInToolbox.length; i++){
                        if( this.unitsInToolbox[i].uid == toolbox_item_uid){
                            ind_to_remove = i
                            break;
                        }
                    }
                    if( ind_to_remove != -1){
                        this.unitsInToolbox.splice(ind_to_remove,1)
                    }
                }
                else {
                    console.error("Error", response);
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
            });
        },

        addAppReleaseToToolbox:function(release){
                let module_release_uid = release.uid;
                var self = this;
                //this.isLoading = true;
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
                axios.put(this.SERVER_URL() + "/dev/toolbox/",
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
                            //this.isLoading = false;
                            this.loadToolbox();
                        }
                        else {
                            console.error("Error", response);
                            
                            //this.statusMessage =  "Module release addition to toolbox failed.\n" + response
                            //$('#alerts_fail').show();
                        }
                        //this.isLoading = false;
                        
    
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
                
            
        },

        //copied from ComputationsApplications.js !!!
        isAppOwnedByCurrentUser(app){
            for(let i=0; i < this.authoredUnits.length; i++){
                if (this.authoredUnits[i].uid == app.uid){
                    return true;
                }
            }
            
            return false;
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
            axios.put(this.SERVER_URL() + "dev/appRelease/",
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
                        this.loadData();
                        this.addNotification("App release created successfully");
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },
        getReleaseStatusNameByID:function(releaseStatusID){
            switch(releaseStatusID){
                case 0 : return "Created";
                case 1 : return "Submitted";
                case 2 : return "Approved";
                case 3 : return "Deprecated";
                case 4 : return "Removed";
            }
           
            return "Unknown";
        },

        loadToolbox:function(){
            var self = this;
            //this.isLoading = true;
            // axios.get(this.SERVER_URL() + "dev/toolbox/", 
            // {
            //     headers: {
            //         'Authorization': 'Bearer ' + this.validToken(),
            //         'Content-Type': 'application/json; charset=utf-8',
            //     }
            // }
            // )
            axios.get(this.SERVER_URL() + "dev/toolbox/")
            .then(response => {
                console.log("get /dev/toolbox/", response);
                
                if ( response.status == 200 && response.data.success ) {
                    this.unitsInToolbox = response.data.data
                    
                }
                else {
                    console.error("Error", response);
                }
                //this.isLoading=false;
            })
            .catch(error => {
                self.processErrorInPromise(error)
            });
        },

    }

}
