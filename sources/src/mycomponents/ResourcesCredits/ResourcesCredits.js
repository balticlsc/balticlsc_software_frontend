import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
//import Vue from 'vue'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
    mixins:[mymixin, utils],
    components: { DatePicker },
    mounted() {
        var self = this;
        
        self.clusterId = self.$route.params['clusterId'];

        var backend = self.SERVER_URL();
        axios.get(backend + "resource/creditstatistics")
                .then(response => { 
                    self.processCreditsResponse(response);
                });
    },

    data: function() {
        return {
            clusterId: "",
            charts: [],
            value: [new Date(2019, 9, 8), new Date(2019, 9, 19)],
        }
    },

    methods: {

        processCreditsResponse: function(response) {
            var self = this;

            if (response.status == 200) {
                var data_in = self.processResponse(response);
                self.charts = _.map(data_in, function(item, i) {
                                    var pairs = _.map(item.intervals, function(interval, i) {
                                                    var pair = [interval, item.credits[i]];
                                                    return pair;
                                                });

                                    return {title: "Cluster " + (i + 1), data: pairs};
                                });
            }
            else {
                console.error("Error", response);
            }
        },

        handleChange: function(value, type) {
            var self = this;

            console.log("in handle change")
            console.log("value ", value)
            console.log("type ", type)

            if (_.size(value) < 2) {
                console.error("Error in interval", value);
                return;
            }

            var start_date = self.$moment(value[0]).format("YYYY-MM-DD");
            var end_date = self.$moment(value[1]).format("YYYY-MM-DD");

            console.log("start date ", start_date);
            console.log("end date ", end_date);


            // var backend = this.SERVER_URL();
            // axios.get(backend + "resource/creditstatistics")
            //         .then(response => { 
            //             self.processCreditsResponse(response);
            //         });

        },

    },
}

