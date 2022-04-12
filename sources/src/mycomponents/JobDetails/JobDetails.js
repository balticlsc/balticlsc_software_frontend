import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'

export default {
    mixins:[mymixin, utils],

    mounted: function() {
        var self = this;
        var backend = this.SERVER_URL();

        var job_id = this.$route.params['id'];

        console.log("job id ", job_id);


        // http://localhost:8050/task/job?computationJobId=1
        axios.get(backend + "task/job?computationJobId=" + job_id)
                .then(response => {
                    console.log("response job", response)
                    if (response.status == 200) {
                        console.log("adsfadsf")
                        var job = self.processResponse(response);

                        console.log("job ", job)
                        self.job = job;

                    }
                    else {
                        console.error("Error", response);
                    }
                });
    },

    data: function() {
                return {
                        job: {},
                    };

        // return {
        //     job: {
        //         _id: "111",
        //         name: "FB",
        //         taskId: "222",
        //         startTime: this.$moment("2013-02-08 09:30:26"),
        //         endTime: this.$moment("2013-02-08 09:40:28"),
        //         status: "Done",
        //         consumedCredits: 333,
        //         reservedCredits: 444,
        //         progress: 100,
        //     },
        //     details: {
        //         gpuTime: 45,
        //         cpuTime: 23,
        //         memoryHours: 23,
        //         storageHours: 22,
        //     },
        // }
    },

    methods: {

        // createNewTask: function(ev) {

        //     console.log("create new task");

        //     var list = {name: $("#task-name").val(),
                    
        //             };

        //     console.log("list ", list);

        // },

        // removeTask: function(ev) {
        //     var self = this;

        //     var task_id = $(ev.target).closest(".task").attr("id");
        //     self.tasks = _.reject(self.tasks, function(task) {
        //                     return task._id == task_id;
        //                 });
        // },

    }

}