import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'
import Vue from 'vue'

const bsTooltip = (el, binding) => {
  const t = []

  if (binding.modifiers.focus) t.push('focus')
  if (binding.modifiers.hover) t.push('hover')
  if (binding.modifiers.click) t.push('click')
  if (!t.length) t.push('hover')

  $(el).tooltip({
    title: binding.value,
    placement: binding.arg || 'top',
    trigger: t.join(' '),
    html: !!binding.modifiers.html,
  });
  $(el).on('click', function () {
    $(this).blur()
})
}

Vue.directive('mytooltip', {
  bind: bsTooltip,
  update: bsTooltip,
  unbind (el) {
    $(el).tooltip('dispose')
  }
});

export default {
    
    mixins:[mymixin, utils],

    mounted: function() {
        this.refresh();
    },
        

    data: function() {
        return {
            task: {parameters: {}, loading: true},
        }
    },

    methods: {
        toggleShowDetails(event){
            //console.log('toggleshowdetails')
    
            var source = event.target || event.srcElement;
            let iElem = null;
            if(source){
                if(source.nodeName == "I"){
                    iElem = source;
                }else{
                    if(source.nodeName == "TD"){
                        iElem = source.firstChild
                    }
                }
            }
            if(iElem){
               if(iElem.classList.contains("fa-chevron-down")){
                    iElem.classList.remove("fa-chevron-down")
                    iElem.classList.add("fa-chevron-up")
               }else{
                    iElem.classList.remove("fa-chevron-up")
                    iElem.classList.add("fa-chevron-down")
               }
            }
            //console.log(source);
        },
        refresh: function() {
            var self = this;
            var backend = self.SERVER_URL();
            //var header = self.getHeader();

            var task_id = this.$route.params['id'];

            self.id = task_id;

            blsc_axios.get(backend + "task?taskUid=" + task_id)
                .then(response => {
                    self.task.loading = false;
                    if (self.noErrorsInResponse(response)) {
                        
                        var data = self.processResponse(response);

                        self.task = data.data;
                        //Generate bunch of batches for testing purposes - expand/collapse
                        //var batch_seed = {"uid":"925ec47a-b07d-4f92-89cc-c7a8746a2c6c","depthLevel":0,"serialNo":1,"jobs":[{"uid":"10a6537c-5464-469c-b4f4-ef225e0f7969","unitUid":"copy_in_rel_001","multiplicity":1,"callName":"copy-in (1)","status":7,"start":"0001-01-01T00:00:00","finish":"0001-01-01T00:00:00","jobMsgUid":"ffe336e6-92bd-4d84-9803-c8094dacdff1","progress":0,"estimatedTime":0.0,"tokensReceived":0,"tokensProcessed":0}],"status":0,"start":"0001-01-01T00:00:00","finish":"0001-01-01T00:00:00","batchMsgUid":"61116736-2228-42b8-8bef-5b80fb93de3f","dataTransfer":0.0,"storageFinish":"0001-01-01T00:00:00","estimatedCredits":0.0,"consumedCredits":0.0,"consumedStorageCredits":0.0,"tokensReceived":0,"tokensProcessed":0};
                        //self.task.batches = _.map([...Array(20).keys()], function(i) {
                        //    var clonedBatch = JSON.parse(JSON.stringify(batch_seed));
                        //    clonedBatch.batchMsgUid = "925ec47a-b07d-4f92-89cc-c7a8746a2c6c" + i;
                        //    clonedBatch.uid = "925ec47a-b07d-4f92-89cc-c7a8746a2c6c" + (i % 5);
                        //    return clonedBatch;
                        //});

                        var private_map = {0: "Public", 1: "Private",};
                        var status_map = {0: "Idle",
                                            1: "Working",
                                            2: "Completed",
                                            3: "Failed",
                                            4: "Rejected",
                                            5: "Aborted",
                                            6: "Neglected",
                                            7: "Scheduled",
                                        };

                        //var fhPolicy_map = { 0:"Break", 1:"Continue", 2:"Freeze"};
                        
                        self.task.batches = _.map(self.task.batches, function(batch) {
                                                _.extend(batch, {_status: status_map[batch.status] || status_map[0],
                                                                 _start: self.TimeString(batch.start),
                                                                 _finish: self.TimeString(batch.finish),
                                                                });

                                                batch.jobs = _.map(batch.jobs, function(job) {
                                                                _.extend(job, { _status: status_map[job.status] || status_map[0],
                                                                                _start: self.TimeString(job.start),
                                                                                _finish: self.TimeString(job.finish),
                                                                            });

                                                                return job;
                                                            });
                                                //var all_new_jobs = [];
                                                //var new_ids = ["AAA", "AAA", "AAA", "DDD", "FFF", "FFF", "AAA"];
                                                //_.each(batch.jobs, function(job) { 
                                                //    var new_jobs = _.map(new_ids, function(new_id) {
                                                //        var new_job =  _.clone(job);
                                                //       new_job.unitUid = new_id;
                                                //       if (Math.random()>0.5) {new_job._status = "Finished"};
                                                //        return new_job;
                                                //     });
                                                //    all_new_jobs = _.union(all_new_jobs, new_jobs)
                                                //});
                                                //console.log(all_new_jobs)
                                                
                                                //batch.jobs = all_new_jobs
                                                
                                                batch.jobs = _.groupBy(batch.jobs, function(job) { return job.callName+job.unitUid});
                                                
                                                batch.jobs = _.map(batch.jobs, function(jobsarray) {
                                                    var statuses = _.uniq(_.map(jobsarray, function(job) {return job.status}));
                                                    return {
                                                    callName: jobsarray[0].callName, 
                                                    jobs: jobsarray,
                                                    log_query: _.map(jobsarray, function(job) {return "tag:" + job.jobMsgUid}).join(" "),
                                                    noOfJobs: _.size(jobsarray),
                                                    moduleName: jobsarray[0].moduleName,
                                                    startTime: _.min(_.filter(jobsarray, function(job) { return job._start!=""}), function(job) {return self.$moment(job._start)})._start || "",
                                                    endTime: _.max(_.filter(jobsarray, function(job) { return job._finish!=""}), function(job) {return self.$moment(job._finish)})._finish || "",
                                                    statuses: statuses,
                                                    _status: status_map[_.min(statuses)],
                                                    progress: Math.floor(_.reduce(jobsarray, function(summa, job) { return summa + job.progress}, 0) / _.size(jobsarray)),
                                                    tokensProcessed: _.reduce(jobsarray, function(summa,job){return summa + job.tokensProcessed}, 0),
                                                    tokensRecieved: _.reduce(jobsarray, function(summa,job){return summa + job.tokensReceived}, 0),
                                                    notes: _.filter(_.uniq(_.map(jobsarray, function(job) {return job.note || ""})), function(note) { return note != ""}).join("\n"),    
                                                }})

                                                return batch;
                                            });

                        _.extend(self.task, {_status: status_map[self.task.status] || status_map[0],
                                             _start: self.TimeString(self.task.start),
                                             _finish: self.TimeString(self.task.finish),
                                             _private: private_map[self.task.parameters.isPrivate] || private_map[0],
                                             _fhPolicy: self.task.parameters.fhPolicy,
                                        });


                    }
                    var batches_aggregated = _.groupBy(self.task.batches, function(batchmsg) {return batchmsg.uid });
                    
                    self.task.batches = _.map(batches_aggregated, function(batchmsg_array) {
                        var jobs_aggregated = _.reduce(batchmsg_array, function(jobs, bmsg) {
                            return _.union(jobs, bmsg.jobs)
                        }, []);
                        jobs_aggregated = _.groupBy(jobs_aggregated, function(job) {return job.callName});
                        console.log(jobs_aggregated);
                        
                        jobs_aggregated = _.map(jobs_aggregated, function(jobsarray) {
                            var noOfJobs = _.reduce(jobsarray, function(summa,job){return summa + job.noOfJobs}, 0);
                            var statuses = _.reduce(jobsarray, function(sum, job) {return _.union(sum, job.statuses)}, []);
                            return {
                                callName: jobsarray[0].callName, 
                                noOfJobs: noOfJobs,
                                log_query: _.map(jobsarray, function(job) { return job.log_query}).join(" "),
                                moduleName: jobsarray[0].moduleName,
                                startTime: _.min(_.filter(jobsarray, function(job) { return job.startTime!=""}), function(job) {return self.$moment(job.startTime)}).startTime || "",
                                endTime: _.max(_.filter(jobsarray, function(job) { return job.endTime!=""}), function(job) {return self.$moment(job.endTime)}).endTime || "",
                                statuses: statuses,
                                _status: status_map[_.min(statuses)],
                                progress: Math.floor(_.reduce(jobsarray, function(summa, job) { return summa + job.progress * job.noOfJobs}, 0) / noOfJobs),
                                tokensProcessed: _.reduce(jobsarray, function(summa,job){return summa + job.tokensProcessed}, 0),
                                tokensRecieved: _.reduce(jobsarray, function(summa,job){return summa + job.tokensRecieved}, 0),
                                notes: _.filter(_.uniq(_.map(jobsarray, function(job) {return job.notes || ""})), function(notes) { return notes != ""}).join("\n"),   
                            }
                        });
                        var nodes = _.uniq(_.map(batchmsg_array, function(bmsg) {return bmsg.cluster["name"] || ""}));
                        Vue.nextTick(function () {
                            $('[data-toggle="tooltip"]').tooltip()
                        })
                        return { 
                            uid: batchmsg_array[0].uid,
                            batches: batchmsg_array,
                            jobs: jobs_aggregated,
                            consumedCredits: _.reduce(batchmsg_array, function(summa,bmsg){return summa + bmsg.consumedCredits}, 0),
                            _status: _.min(batchmsg_array, function(bmsg) { return bmsg.status})._status,
                            node: nodes.length <= 1 ? nodes[0] : "various",
                            startTime: _.min(_.filter(batchmsg_array, function(bmsg) { return bmsg._start!=""}), function(bmsg) {return self.$moment(bmsg.start)})._start || "",
                            endTime: _.min(_.filter(batchmsg_array, function(bmsg) { return bmsg._finish!=""}), function(bmsg) {return self.$moment(bmsg._finish)})._finish || "",
                            tokensProcessed: _.reduce(batchmsg_array, function(summa,bmsg){return summa + bmsg.tokensProcessed}, 0),
                            tokensReceived: _.reduce(batchmsg_array, function(summa,bmsg){return summa + bmsg.tokensReceived}, 0)
                        }
                    });
                //console.log(self.task)        
                }).
                catch(error => {
                    self.task.loading = false;
                    console.error(error);
                    self.processErrorInPromise(error);
                });
           
        },
        getLogs: function(query) {
            var graylog_server_url = this.GRAYLOG_SERVER_URL();
            axios.get(graylog_server_url + "api/search/universal/relative", { 
                withCredentials: true,
                params: {
                    query: query,
                    sort: "timestamp:asc",
                    limit:10000
                },
                auth: {
                    username: this.GRAYLOG_USERNAME(),
                    password: this.GRAYLOG_PASSWORD()
                }
                })
                .then(response => {

                    if (response.status == 200) {
                        var grouped_messages = _.groupBy(response.data.messages, function(msg) {return msg.message.tag} );
                        
                        var messages = "<p>BalticLSC Job Execution log<br>=====================================================================";
                        for (const [tag, msg_list] of Object.entries(grouped_messages)) {
                            messages = messages + "<br>" + tag +"<br>"+_.map(msg_list, function(msg) {return "["+msg.message.timestamp+"] "+msg.message.message}).join("<br>");  
                        }
                        messages = messages + "</p>"

                        var LogWindow = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
                        LogWindow.document.write(messages);
                        LogWindow.document.close();
                        
                        Vue.nextTick(function () {
                            $('[data-toggle="tooltip"]').tooltip()
                        })
                        //var data = "data:text/plain;charset=utf-8," + encodeURIComponent(messages);
                        //var link = document.createElement('a');
                        //link.setAttribute("href", data);
                        //link.setAttribute("download", this.id + ".txt");
                        //document.body.appendChild(link); // required for firefox
                        //link.click();
                        //link.remove();   
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error, false);
                });

            
        },
        uuidv4: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
    },
}