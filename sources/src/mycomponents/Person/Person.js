import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'

export default {
    mixins:[mymixin, utils],
    mounted: function() {
        //var self = this;
        //var backend = this.SERVER_URL();

        console.log("in mounted")
    }

    // methods: {


    // },

}
