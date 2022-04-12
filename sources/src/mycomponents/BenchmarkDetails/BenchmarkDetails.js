import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';

export default {
    mixins:[mymixin],
    mounted: function() {
        //var self = this;
        console.log("benchmarks details shelf mounted")

        // this.clusterId = this.$route.params['clusterId'];
    },

    data: function() {
        return {
            // clusterId: "",
            // benchmarks: [{nr: 1, name: "benchmark1", timeScore: 182, resourceScore: 89, date: this.$moment("2019-02-08 09:30:56"),},
            //              {nr: 2, name: "benchmark2", timeScore: 122, resourceScore: 86, date: this.$moment("2019-02-09 05:38:36"),},
            //              {nr: 3, name: "benchmark3", timeScore: 192, resourceScore: 189, date: this.$moment("2019-05-09 19:30:56"),},
            //              {nr: 4, name: "benchmark4", timeScore: 172, resourceScore: 168, date: this.$moment("2019-08-18 12:25:58"),},
            //         ],
        }
    },
		
    methods: {            

    }
}
