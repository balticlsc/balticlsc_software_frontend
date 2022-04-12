import { mymixin } from '../mixins/mixins.js'
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'
// eslint-disable-next-line no-unused-vars
import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
import 'bootstrap-slider/dist/css/bootstrap-slider.css'

export default {
    mixins:[mymixin, utils],

    mounted: function() {
        var self = this;
        var backend = self.SERVER_URL();
        // var header = self.getHeader(self);

        var data = {};

        blsc_axios.post(backend + "task/list", data)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                        var tasks = self.processResponse(response);

                        console.log("tasks ", tasks)

                        self.tasks = tasks.data;

                        self.isTasksLoaded = true;
                        self.mergetAppsAndTasks();
                    } 
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
    
        blsc_axios.get(backend + "app/shelf")
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                        console.log("apps response ", response)

                        var apps = self.processResponse(response);
                        self.apps = apps.data;

                        self.isAppsLoaded = true;

                        self.mergetAppsAndTasks();
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });

        blsc_axios.get(backend + "task/dataShelf")
                .then(response => {
                    if (self.noErrorsInResponse(response)) {

                        var dataSets = self.processResponse(response);
                        self.dataSets = dataSets.data;

                        self.isDataSetsLoaded = true;
                        self.mergetAppsAndTasks();

                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });

    },

    data: function(){
        return {
            value: 18,
            tasks: [],
            apps: [],
            appsWithTasks: [],
            isAppsLoaded: false,
            isTasksLoaded: false,
            backend: this.SERVER_URL(),
            dataSets: [],
            isDataSetsLoaded: false,
            clusters: [],
            loading: true,
            idOfTaskToArchive:null,
        }
    },

    methods: {

        slideStart () {
            console.log('slideStarted')
        },

        slideStop () {
            console.log('slideStopped')
        }, 

        mergetAppsAndTasks: function() {
            var self = this;

            if (self.isAppsLoaded && self.isTasksLoaded && self.isDataSetsLoaded) {

                self.loading = false;

                console.log("self.tasks ", self.tasks)
                // eslint-disable-next-line no-unused-vars
                var _tasks = _.map(self.tasks, function(task, i) {

                                var action = {method: "start", title: "Activate",};
                                if (task.status == "running") {
                                    // action = {method: "stop", title: "Stop",};
                                    action = {method: "", title: "",};
                                }

                                // eslint-disable-next-line no-unused-vars
                                var end_time = "";
                                if (task.status == "finished") {
                                    end_time = self.TimeString(task.endTime);
                                }

                                var _private = "No";
                                if (task.parameters && task.parameters.isPrivate) {
                                    _private = "Yes";
                                }

                                var status_map = {0: "Idle",
                                                    1: "Working",
                                                    2: "Completed",
                                                    3: "Failed",
                                                    4: "Rejected",
                                                    5: "Aborted",
                                                    6: "Neglected",
                                                };
                                
                                var fhPolicy_map = { 0:"Break", 1:"Continue", 2:"Freeze"};


                                _.extend(task, {action: action,
                                                _startTime: self.TimeString(task.start),
                                                _endTime: self.TimeString(task.finish),
                                                _private: _private,
                                                parameters: task.parameters || {taskName: "???", priority: 3, reservedCredits: 0,},
                                                _status: status_map[task.status],
                                                _fhPolicy: task.fhPolicy,
                                        });

                                return task;
                            });

                var apps = _.groupBy(self.apps, function(app) {
                                return app.unit.uid;
                            });

                self.appsWithTasks = _.map(apps, function(app_releases) {
                                        var app_out = {tasks: [],
                                                        versions: [],
                                                    };

                                        _.each(app_releases, function(app_release) {
                                            

                                            _.each(app_release.pins, function(pin) {
                                                var possible_datasets = _.filter(self.dataSets, function(dataSet) {
                                                    return (((dataSet.dataTypeName == pin.dataType) || pin.dataType==null || pin.dataType=="any_data" || true ) 
                                                    && (dataSet.accessTypeUid == pin.accessTypeUid))
                                                });
                                                _.extend(pin, {dataSets: possible_datasets});
                                            })

                                            var tasks = _.filter(_tasks, function(task) {
                                                            return task.releaseUid == app_release.uid;
                                                        });

                                            var app_form_id = "form_" + app_release.uid;
                                            _.extend(app_out, {
                                                                formId: app_form_id,
                                                                form: "#" + app_form_id,
                                                                uid: app_release.unit.uid,
                                                                name: app_release.unit.name,
                                                                auxStorageCredits: {range: [116, 343], min: 0, max: 500,},
                                                                cpu: {range: [22, 33], min: 0, max: 100,},
                                                                gpu: {range: [31, 45], min: 0, max: 220,},
                                                                memory: {range: [54, 77], min: 0, max: 150,},
                                                                storage: {range: [41, 56], min: 0, max: 220,},
                                                            });

                                            app_out.versions.push({version: app_release.version, releaseUid: app_release.uid});

                                            if (tasks) {
                                                tasks = _.map(tasks, function(task) {
                                                            var form_id = "form_" + task.uid;
                                                            _.extend(task, {_version: app_release.version,
                                                                            _diagram: app_release.diagramUid,
                                                                            form: "#" + form_id,
                                                                            formId: form_id,
                                                                            formIdAbort: form_id + "abort",
                                                                            formAbort: "#" + form_id + "abort",
                                                                            pins: app_release.pins,
                                                                        });
                                                            return task;
                                                        });

                                                app_out.tasks = _.union(app_out.tasks, tasks);
                                            }

                                        });

                                        return app_out;
                                    });

                console.log("self.appsWithTasks ", self.appsWithTasks)
            }
        },

        createNewTask: function(ev) {
            var self = this;

            var list = self.getTaskInfo(ev);
            console.log("list ", list);

            if (list.taskName == "") {
                self.addNotification("Task not created - empty task name!","error");
                return;
            }

            var backend = self.SERVER_URL();

            blsc_axios.put(backend + "task/initiate?releaseUid=" + list.versionId, list)
                    .then(response => {

                        if (self.noErrorsInResponse(response)) {
                            var taskUid = self.processResponse(response).data;

                            blsc_axios.get(backend + "task?taskUid=" + taskUid)
                                .then(gettaskresponse => {
                                    if (self.noErrorsInResponse(gettaskresponse)) {
                                        var task = self.processResponse(gettaskresponse).data;
                                        self.tasks.push(task);
                                        self.mergetAppsAndTasks();
                                    }
                                })
                                .catch(error => {
                                    self.processErrorInPromise(error)
                                })                           
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    }) ;
        },


        createAndInsertTask: function(ev) {
            var self = this;

            console.log("createAndInsertTask")


            var list = self.getTaskInfo(ev);

            console.log("task info ", list)


            //var backend = self.SERVER_URL();

        },


        getTaskInfo: function(ev) {
            var form = $(ev.target).closest(".modal");

            // eslint-disable-next-line no-unused-vars
            var aux_storage = form.find("#new-aux-storage-credits");
            var cpu = form.find("#new-cpu");
            var gpu = form.find("#new-gpu");
            var memory = form.find("#new-memory");
            var storage = form.find("#new-storage");

            //var fhPolicy_map = { "Break":0, "Continue":1, "Freeze":2};

            return {
                    taskName: form.find("#new-task-name").val(),
                    versionId: form.find("#release").find(":selected").attr("value"),
                    priority: form.find('#new-priority').find(":selected").attr("value"),
                    reservedCredits: form.find("#new-reserved-credits").val(),
                    isPrivate: form.find("#new-is-private").prop("checked"),
                    invariants: [],
                    clusterAllocation: form.find("input[name='gridRadios']:checked").val(),
                    clusterUid: form.find("#cluster").find(":selected").attr("value"),
                    auxStorageCredits: form.find("#new-auxstorage-credits").val(),
                    //maxAuxStorageCredits: aux_storage.find(".max-slider-handle").attr("aria-valuenow"),

                    minCPUs: cpu.find(".min-slider-handle").attr("aria-valuenow"),
                    maxCPUs: cpu.find(".max-slider-handle").attr("aria-valuenow"),

                    minGPUs: gpu.find(".min-slider-handle").attr("aria-valuenow"),
                    maxGPUs: gpu.find(".max-slider-handle").attr("aria-valuenow"),

                    minMemory: memory.find(".min-slider-handle").attr("aria-valuenow"),
                    maxMemory: memory.find(".max-slider-handle").attr("aria-valuenow"),

                    minStorage: storage.find(".min-slider-handle").attr("aria-valuenow"),
                    maxStorage: storage.find(".max-slider-handle").attr("aria-valuenow"),
                    fhPolicy: form.find("input[name='gridRadios2']:checked").val(),
                };

                //  "taskName": "My Task",
                //  "priority": 3,
                //  "clusterAllocation": "",
                //  "reservedCredits": 110,
                //  "auxStorageCredits": 100,
                //  "isPrivate": false,
                //  "invariants": [
                   
                //  ],
                //  "minCPUs": 1,
                //  "minGPUs": 2,
                //  "minMemory": 3,
                //  "minStorage": 4,
                //  "maxCPUs": 5,
                //  "maxGPUs": 6,
                //  "maxMemory": 7,
                //  "maxStorage": 8
                // }'

        },

        InsertDataSets: function(ev) {
            var self = this;
            var pins = [];
            
            var taskUid = $(ev.target).closest(".insert-task-form").attr("data-app")
            $(ev.target).closest(".insert-task-form").find(".form-group").map(function() {
                $(this).find("select").map(function() {
                    var dataSetUid = $(this).find(":selected").attr("id");
                    var pinUid = $(this).attr("id");
                    pins.push({dataSetUid: dataSetUid, pinUid: pinUid})
                }) 
            })
            
            var requests = [];
            _.each(pins, function(pin) {
                var req = blsc_axios.post(self.backend + "task/injectData?taskUid=" + taskUid +"&pinUid=" + pin.pinUid + "&dataSetUid=" + pin.dataSetUid )
                requests.push(req)
            })

            Promise
            .all(requests)
            .then((responses) => {
                    _.forEach(responses, self.noErrorsInResponse);
                    blsc_axios.get(self.backend + "task?taskUid=" + taskUid)
                                .then(gettaskresponse => {
                                    if (gettaskresponse.status == 200) {
                                        var task = self.processResponse(gettaskresponse).data;
                                        self.tasks = _.reject(self.tasks, function(t) {return t.uid==taskUid})
                                        self.tasks.push(task);
                                        self.mergetAppsAndTasks();
                                    }
                                }) 
                })
            

        },
        
        removeTaskById(self, task_id) {
            var backend = self.SERVER_URL();
            blsc_axios.delete(backend + "task?taskUid=" + task_id)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
        
                        self.tasks = _.reject(self.tasks, function (task) {
                            return task.uid == task_id;
                        });
        
                        self.mergetAppsAndTasks();
                    };
                })
                .catch(error => {
                    this.processErrorInPromise(error);
                });
        },

        removeTask: function(ev) {
            var self = this;

            var task_id = $(ev.target).closest(".task").attr("id");

            this.removeTaskById(self, task_id);
        },
        
        removeTask2: function() {
            var self = this;

            var task_id = this.idOfTaskToArchive;

            this.removeTaskById(self, task_id);
        },

        abortTask: function(ev) {
            var self = this;

            var task_id = $(ev.target).closest(".task").attr("id");

            var backend = self.SERVER_URL();
            blsc_axios.delete(backend + "task/abort?taskUid=" + task_id, {})
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            blsc_axios.get(self.backend + "task?taskUid=" + task_id)
                                .then(gettaskresponse => {
                                    if (this.noErrorsInResponse(gettaskresponse)) {
                                        var task = self.processResponse(gettaskresponse).data;
                                        if (task.status != 5) {
                                            self.addNotification("Abort process for the task "+ task_id+" started! Please refresh the status after a minute!")
                                        } else {
                                            self.tasks = _.reject(self.tasks, function(t) {return t.uid==task_id})
                                            self.tasks.push(task);
                                            self.mergetAppsAndTasks();
                                        }
                                        
                                    }
                                })
                                .catch(error=> {
                                    self.processErrorInPromise(error);
                                });
                            
                        }
                    })
                    .catch(error=> {
                        self.processErrorInPromise(error);
                    });
        },

        getAvailableClustersForRelease: function(appReleaseId) {
            var self = this;
            blsc_axios.get(self.backend + "task/clusters?appReleaseUid=" + appReleaseId)
                                .then(response => {
                                    if (this.noErrorsInResponse(response)) {
                                        self.clusters = [{uid: "", name: "Determined by the BalticLSC Software"}]
                                        self.clusters = _.union(self.clusters, self.processResponse(response).data);    
                                    }
                                })
                                .catch(error=> {
                                    self.processErrorInPromise(error);
                                });
        }, 

        isInsertable: function(task) {
            // TODO: check the Types:ComputationStatus!!!!!!!
            return task.status == 1;
        },

        isStartable: function(task) {
            // TODO: check the Types:ComputationStatus!!!!!!!
            return task.status == 0 || task.status == 6;
        },

        isAbortable: function(task) {
            return task.status == 0 || task.status == 1 || task.status == 6;
        },

        isFinished: function(task) {
            return task.status == "finished";
        },

        filterPins: function(pins, bindings) {
            return _.filter(pins, function(pin) { return _.contains(bindings, pin.binding)});
        },

        stop: function(ev) {
            var self = this;

            var list = {id: $(ev.target).closest(".task").attr("id"),};

            console.log("list ", list)


            blsc_axios.post(self.backend + "task/pause?computationTaskId=" + list.id, {})
                    .then(response => {
                        if (response.status == 200) {
                                
                            console.log("stop response ", response);

                            var task = self.processResponse(response);

                            var tmp_task = _.find(self.tasks, function(task_in) {
                                                return task_in.id == task.id;
                                            });

                            _.extend(tmp_task, task);
                        }
                        else {
                           console.error("Error", response); 
                        }
                    });


        },

        start: function(ev) {
            //var self = this;

            console.log("in inseert task")


            var list = {id: $(ev.target).closest(".task").attr("id"),};

            console.log("list ", list)

            // var backend = "http://185.23.162.184:443/";
            // axios.get(backend + "task/activate?computationTaskId=" + list.id)
            //         .then(response => {
            //             if (response.status == 200) {
                                
            //                 console.log("start response ", response);

            //                 var task = self.processResponse(response);

            //                 var tmp_task = _.find(self.tasks, function(task_in) {
            //                                     return task_in.id == task.id;
            //                                 });

            //                 task.action = {method: "", title: "",};

            //                 _.extend(tmp_task, task);
            //             }
            //             else {
            //                console.error("Error", response); 
            //             }
            //         });
        },

        AddTaskVersionChanged: function(ev) {
            var appReleaseUid = ev.target.value;
            this.getAvailableClustersForRelease(appReleaseUid);
        },

        AddTaskClusterAllocationChanged: function(ev) {
            var isStrong = ev.target.value;
            $(ev.target).closest(".card").find("#cluster option:eq(0)").prop('selected', true);
            if (isStrong=="strong") { $(ev.target).closest(".card").find("#cluster").prop('disabled', false); } 
            else {$(ev.target).closest(".card").find("#cluster").prop('disabled', true); }

        },

    }

}


