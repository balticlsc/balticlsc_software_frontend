import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'

export default {
    name: "TopBar",
    mixins:[mymixin, utils],
    data: function() {
        return {user: this.getUsername(),}
    },

    methods: {
        // eslint-disable-next-line no-unused-vars
        logout(ev) {
            var self = this;

            blsc_axios.get(this.SERVER_URL() + "Login/Logout")
                    .then(response => {

                        if (self.noErrorsInResponse(response)) {

                            self.$session.destroy();
                            localStorage.clear();
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error);
                    })
                    .finally(() => { self.$router.push('/'); });
        },

    }
}