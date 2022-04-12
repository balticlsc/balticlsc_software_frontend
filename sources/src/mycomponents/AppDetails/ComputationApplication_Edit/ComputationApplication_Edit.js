import { mymixin } from '../../mixins/mixins.js'
import { _ } from 'vue-underscore'
import utils from '../../../utils/utils'
import axios from '../../../utils/axios'

export default {
    mixins:[mymixin, utils],
    mounted: function() {
        this.isLoading = true;
        var self = this;

        const backend = this.SERVER_URL();
        const app_id = this.$route.params['id'];
        console.log("app id ", app_id);
        const app_request = axios.get(backend + "app",
        {
            params: {
                appUid: app_id
            }
        });
        const shelf_request =  axios.get(backend + "app/shelf");
        
        Promise
            .all([app_request, shelf_request])
            .then((responses) => {
                    const app_response = responses[0];
                    const shelf_response = responses[1];
                    
                    if (self.noErrorsInResponse(app_response) && self.noErrorsInResponse(shelf_response)) 
                    {
                        self.myApps = self.processResponse(shelf_response).data;
                        self.myApps = _.groupBy(self.myApps, function(myapp) {
                            return myapp.uid
                        });
                        self.app = app_response.data.data;

                        self.processApp();

                        if( self.app.keywords == null){
                            self.app.keywords = [];
                        }
                    }
                    this.isLoading = false;
                })
    },

    data: function() {
        return {
            app: {},
            myApps: [],
            currentKeyword:"",
            isLoading:false,
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

        updateModule(){
            console.log("um");
            let self = this;
            axios.post(this.SERVER_URL() + "dev/unit/",{
                "name": this.app.name,
                "uid": this.app.uid,
                "pClass": this.app.pClass,
                "shortDescription": this.app.shortDescription,
                "longDescription": this.app.longDescription,
                "keywords": this.app.keywords,
                "icon": this.app.icon,
                "isApp": true
            })
            .then(response => {
                //console.log("get /dev/toolbox/", response);
                
                if ( response.status == 200 && response.data.success ) {
                    self.addNotification("App " + self.app.uid + " update succeeded.", "info");
                    //self.$router.push('/development-shelf');
                }
                
            }).catch(error => {
                self.processErrorInPromise(error)
            });
        },

        addKeyword(){
            this.app.keywords.push(this.currentKeyword);
            this.currentKeyword='';
        },
    }
}
