import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'

import blsc_axios from '../../utils/axios'

export default {
    mixins:[mymixin, utils],

    mounted: function() {
        var self = this;
        var backend = this.SERVER_URL();
        
        axios.get(backend + "moduleshelf")
                .then(response => {

                    console.log("response", response)

                    if (response.status == 200) {
                        self.modules = self.processResponse(response);

                        self.modules = _.map(self.modules, function(mod) {
                                            _.extend(mod, {_lastUpdateDate: self.$moment(mod.lastUpdateDate).format("YYYY-MM-DD"),})
                                            return mod;
                                        });
                    }
                    else {
                        console.error("Error", response);
                    }

                });
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
                console.log("post response", response);
                // response.data = _.map(response.data, function(id) {
                //                     return {id: id,
                //                             name: id,
                //                         };
                //                 });
                if (response.status == 200) {
                    //this.authoredApplications.length = 0
                    this.modules.length = 0
                    //self.authoredUnits = response.data.data;
                    for (let i = 0; i < response.data.data.length; i++) {
                        let unit = response.data.data[i];
                        unit._lastUpdateDate = new Date().toDateString()
                        if (unit.isApp == true) {
                            this.authoredApplications.push(unit);
                        }
                        else {
                            this.modules.push(unit);
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
            });
    },

    data: function() {
        return {modules: [],};
    },

    methods: {
    },
}