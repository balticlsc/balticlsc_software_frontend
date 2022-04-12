import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import axios from '../../utils/axios'

export default {
    mixins:[mymixin, utils],
    mounted: function() {
        var self = this;

        var backend = this.SERVER_URL();
        axios.get(backend + "resource/shelf")
                .then(response => {
                    if (this.noErrorsInResponse(response)) {
                        self.clusters = self.processResponse(response);
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
    },

    data: function() {
        return {
            clusters: [],
        }
    },
		
    methods: {
    }
}
