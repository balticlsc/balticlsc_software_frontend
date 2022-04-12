import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';

export default {
    mixins:[mymixin],
    mounted: function() {
        //var self = this;
        console.log("cluster machines shelf mounted")

        this.clusterId = this.$route.params['clusterId'];
    },

    data: function() {
        return {
            clusterId: "",
            machines: [{nr: 1, id: "12", cpu: 56, gpu: 89, memory: "64GB", storage: "18TB",},
                        {nr: 2, id: "13", cpu: 57, gpu: 189, memory: "96GB", storage: "25TB",},
                        {nr: 3, id: "17", cpu: 26, gpu: 47, memory: "52GB", storage: "34B",},
                        {nr: 4, id: "26", cpu: 16, gpu: 24, memory: "23GB", storage: "28TB",},
                ],
        }
    },
		
    methods: {

    }
}
