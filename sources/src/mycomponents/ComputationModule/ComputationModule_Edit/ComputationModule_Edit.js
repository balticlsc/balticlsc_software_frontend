import { mymixin } from '../../mixins/mixins.js'
import { _ } from 'vue-underscore'
import utils from '../../../utils/utils'
import blsc_axios from '../../../utils/axios'

export default {
    mixins:[mymixin, utils],
    mounted: function() {
        
        
        //var self = this;

        //const backend = this.SERVER_URL();
        const module_id = this.$route.params['moduleId'];
        
        const body = {
            //"onlyApps" : true //atlasam visu ieks then skirojam kas ir modulis, kas ir app; skirosana vajadziga jo backends neapstrada onlyapps:false
        };

        // axios.post(this.SERVER_URL() + "dev/unit/list/", body, {
        //     headers: {
        //         'Authorization': 'Bearer ' + this.validToken(),
        //         'Content-Type': 'application/json; charset=utf-8',
        //     }
        // })
        blsc_axios.post(this.SERVER_URL() + "dev/unit/list/", body)
        .then(response => {
            console.log("post response dev/unit/list/", response);
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
                    let unit = response.data.data[i];
                    unit._lastUpdateDate = new Date().toDateString()
                    if (unit.uid === module_id) {
                        this.module = unit;
                        if( this.module.keywords == null){
                            this.module.keywords = []
                        }
                        break;
                    }
                }
                if(this.module == null){
                    this.loaded = false;
                    console.log("Module was not found.")
                }else{
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
    },

    data: function() {
        return {
            module: null,
            loaded: false,
            modulesInToolbox:[],
            isLoading:false,
            currentKeyword:"",
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
                case "0": return "Required-Weak";
                case "1": return "Required-Strong";
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
        
        updateModule(){
            console.log("um");
            let self = this;
            blsc_axios.post(this.SERVER_URL() + "dev/unit/",{
                "name": this.module.name,
                "uid": this.module.uid,
                "pClass": this.module.pClass,
                "shortDescription": this.module.shortDescription,
                "longDescription": this.module.longDescription,
                "keywords": this.module.keywords,
                "icon": this.module.icon,
                //"isApp": true
            })
            .then(response => {
                //console.log("get /dev/toolbox/", response);
                
                if ( response.status == 200 && response.data.success ) {
                    self.addNotification("Module " + self.module.uid + " update succeeded.", "info");
                    //self.$router.push('/development-shelf');
                }
                
            }).catch(error => {
                self.processErrorInPromise(error)
            });
        },

        addKeyword(){
            this.module.keywords.push(this.currentKeyword);
            this.currentKeyword='';
        },
    }
}
