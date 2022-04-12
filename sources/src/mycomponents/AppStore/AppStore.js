import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'
    
export default {
    mixins:[mymixin, utils],
    mounted: function() {
        var self = this;
        var backend = self.SERVER_URL();
        //var header = self.getHeader(self);

        var applist_params = {
                    "onlyApps": true,
                    "onlyLastRelease": false };

        const request_shelf = blsc_axios.get(backend + "app/shelf");
        const request_allapps = blsc_axios.post(backend + "app/list", applist_params);

        Promise
            .all([request_shelf, request_allapps])
            .then((responses) => {
                    const response_shelf = responses[0];
                    const response_allapps = responses[1];
                    
                    if (self.noErrorsInResponse(response_shelf) && self.noErrorsInResponse(response_allapps)) {
                        self.myApps = self.processResponse(response_shelf).data;
                        self.myApps = _.groupBy(self.myApps, function(myapp) {
                            return myapp.unit.uid
                        });
                        self.allApps = self.processResponse(response_allapps).data;
                        self.allApps = _.filter(self.allApps, function(app) { return app.releases[0]});
                        self.processApps();
                    }
                })
            .catch(error => {
                self.processErrorInPromise(error)
            }); 
    },

    data: function() {
        return {
            myApps: [],
            allApps: [],
            appsList: [],
        }
    },


    methods: {            

        processApps: function() {
            var self = this; 

            self.appsList = _.map(self.allApps, function(app) {
                    var my_app = self.myApps[app.uid]
                    if (my_app) { _.extend(app, {isInstalled: true,});}
                    _.extend(app, {
                        _lastUpdateDate: app.releases[0].date,
                        //timesUsed: Math.floor(Math.random() * 100000),
                        //rate: Math.floor(Math.random() * 9) + 1 
                    });
                    return app;
            });
           
        },

        installApp: function(ev) {
            var self = this;

            var backend = self.SERVER_URL();
            //var header = self.getHeader(self);

            var latest_release_id = $(ev.target).closest(".app").attr("relid");
            var app_id = $(ev.target).closest(".app").attr("id");

            blsc_axios.post(backend + "app/shelf?releaseUid=" + latest_release_id, {})
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                                self.myApps[app_id] = true;
                                self.processApps();
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });;
        },
        getLatestRelease: function(unit) {
            var self=this;
            var release =  _.last(
                             _.sortBy(
                               _.filter(unit.releases, function(rel) {return ! self.isReleaseDeprecated(rel)})
                             , function(r) {return r.date})
                            )
            if (release) { return release.uid} else { return null }; 
        },

        isReleaseDeprecated: function(release) {
            return release.status == 3
        },

        isUnitDeprecated: function(unit) {
            var self = this;
            return _.every(unit.releases, function(release) { return self.isReleaseDeprecated(release)});
        },

        

    }
}
