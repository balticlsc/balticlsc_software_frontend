import { mymixin } from '../../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../../utils/utils'

export default {
    mixins:[mymixin, utils],

    mounted: function() {

    },

    data: function() {
        return {
            validateModuleRelease:false,
            moduleReleaseName:"",
            moduleYAMLContent:"",
            statusMessage:""
        };
    },

    methods: {
        
        
    },
}


