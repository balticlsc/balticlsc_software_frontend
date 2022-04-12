import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';

export default {
    mixins:[mymixin],
    data: function(){
        return {

            runningJobs: [{nr: 1, _id: "j111", name: "j111 name", taskId: "1111", appId: "22", appName: "Spotify", startTime: this.$moment("2013-02-08 09:30:26"),
                            endTime: this.$moment("2013-02-08 09:30:56"), jobStatus: "Running", consumedCredits: 53, reservedCredits: 89, progress: 37,},

                            {nr: 2, _id: "j1112", taskId: "1111", appId: "22", appName: "Spotify", startTime: this.$moment("2018-02-08 10:30:26"),
                            endTime: this.$moment("2018-02-08 10:50:56"), jobStatus: "Running", consumedCredits: 153, reservedCredits: 189, progress: 36,},

                            {nr: 3, _id: "j1113", taskId: "222", appId: "22", appName: "Youtube", startTime: this.$moment("2019-05-08 09:30:26"),
                            endTime: this.$moment("2019-05-08 09:40:26"), jobStatus: "Running", consumedCredits: 253, reservedCredits: 289, progress: 86,},

                            {nr: 4, _id: "j1114", taskId: "3333", appId: "22", appName: "FB", startTime: this.$moment("2019-05-09 09:30:26"),
                            endTime: this.$moment("2019-05-09 09:50:26"), jobStatus: "Running", consumedCredits: 253, reservedCredits: 589, progress: 96,},

                            {nr: 5, _id: "j1115", taskId: "3333", appId: "3333", appName: "FB", startTime: this.$moment("2019-05-08 12:30:26"),
                            endTime: this.$moment("2019-05-08 12:50:26"), jobStatus: "Running", consumedCredits: 453, reservedCredits: 589, progress: 26,},
                        ],

            finishedJobs: [{nr: 4, _id: "j1114", taskId: "3333", appId: "22", appName: "FB", startTime: this.$moment("2019-08-08 10:30:26"),
                            endTime: this.$moment("2019-05-08 11:32:28"), jobStatus: "Running", consumedCredits: 253, reservedCredits: 589, progress: 96,},

                            {nr: 5, _id: "j1115", taskId: "3333", appId: "3333", appName: "FB", startTime: this.$moment("2019-09-08 09:30:26"),
                            endTime: this.$moment("2019-09-08 09:45:29"), jobStatus: "Running", consumedCredits: 453, reservedCredits: 589, progress: 26,},
                        ],

        }
    },

    methods: {            
        removeJob: function(ev) {
            var self = this;

            var job_id = $(ev.target).closest(".job").attr("id");
            self.jobs = _.reject(self.jobs, function(job) {
                            return job._id == job_id;
                        });                        
        }
    }
}