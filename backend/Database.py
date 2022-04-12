import datetime
import random


class Database:
    def __init__(self):
        self.apps = {}
        self.shelf = []
        self.tasks = {}
        self.jobs = {}
        self.clusters = {}
        self._last_app_id = -1
        self._last_task_id = 0
        self._last_job_id = 0
        self._last_cluster_id = 0
        self.create_demo_db()

    def create_demo_db(self):
        app1_id = self.add_app({
            "forkId": 1080,
            "name": "Pi Computer",
            "shortDescription": "Pi Computing app",
            "fullDescription": "Pi computing application that uses advantage numeric methods to compute pi number with high accuracy",
            "rate": 10,
            "authorId": 1311,
            "authorFullName": "John Walker",
            "icon": "pi_computer.png",
            "keywords": [
                "pi",
                "computing",
                "high",
                "accuracy"
            ],
            "lastUpdateDate": "2019-03-14T00:00:00",
            "timesUsed": 6000,
            "openSource": True,
            "releases": [
                {
                    "id": 4141,
                    "computationApplicationId": 0,
                    "version": "v1.0",
                    "fullDescription": "Pi computing application that uses advantage numeric methods to compute pi number with high accuracy",
                    "available": False,
                    "authorId": 1311,
                    "parentId": 5745,
                    "authorName": "John Walker",
                    "assetId": 1786,
                    "releaseDate": "2018-03-14T00:00:00",
                    "usageCounter": 4646644,
                    "openSource": False,
                    "private": True
                },
                {
                    "id": 3842,
                    "computationApplicationId": 0,
                    "version": "v2.0",
                    "fullDescription": "Pi computing application that uses advantage numeric methods to compute pi number with high accuracy",
                    "available": True,
                    "authorId": 1311,
                    "parentId": 5745,
                    "authorName": "John Walker",
                    "assetId": 1789,
                    "releaseDate": "2018-06-14T00:00:00",
                    "usageCounter": 464600000,
                    "openSource": True,
                    "private": False
                }
            ]
        })
        app2_id = self.add_app({
            "forkId": 121,
            "name": "Hypergraphs",
            "shortDescription": "Hypergraphs Based on Pythagorean Fuzzy Soft Model.",
            "fullDescription": "  Abstract A Pythagorean fuzzy soft set (PFSS) model is an extension of an intuitionistic fuzzy soft set (IFSS) model to deal with vague knowledge according to different parameters.",
            "rate": 8,
            "authorId": 122,
            "authorFullName": "Mary Brown",
            "icon": " ",
            "keywords": [
                "Application",
                " Computation Application",
                "Hypergraphs",
                "PFSS"
            ],
            "lastUpdateDate": "2019-12-03T13:09:21",
            "timesUsed": 123,
            "openSource": True,
            "releases": [
                {
                    "id": 125,
                    "computationApplicationId": 1,
                    "version": None,
                    "fullDescription": "  New Release Abstract A Pythagorean fuzzy soft set (PFSS) model is an extension of an intuitionistic fuzzy soft set (IFSS) model to deal with vague knowledge according to different parameters.",
                    "available": True,
                    "authorId": 122,
                    "parentId": 120,
                    "authorName": "Mary Brown",
                    "assetId": 124,
                    "releaseDate": "0001-01-01T00:00:00",
                    "usageCounter": 0,
                    "openSource": True,
                    "private": False
                },
                {
                    "id": 127,
                    "computationApplicationId": 1,
                    "version": None,
                    "fullDescription": "  New Release Abstract A Pythagorean fuzzy soft set (PFSS) model is an extension of an intuitionistic fuzzy soft set (IFSS) model to deal with vague knowledge according to different parameters.",
                    "available": True,
                    "authorId": 122,
                    "parentId": 120,
                    "authorName": "Mary Brown",
                    "assetId": 126,
                    "releaseDate": "0001-01-01T00:00:00",
                    "usageCounter": 0,
                    "openSource": True,
                    "private": False
                },
                {
                    "id": 129,
                    "computationApplicationId": 1,
                    "version": None,
                    "fullDescription": "  New Release Abstract A Pythagorean fuzzy soft set (PFSS) model is an extension of an intuitionistic fuzzy soft set (IFSS) model to deal with vague knowledge according to different parameters.",
                    "available": True,
                    "authorId": 122,
                    "parentId": 120,
                    "authorName": "Mary Brown",
                    "assetId": 128,
                    "releaseDate": "0001-01-01T00:00:00",
                    "usageCounter": 0,
                    "openSource": True,
                    "private": False
                }
            ]
        })
        app3_id = self.add_app({
            "forkId": 1,
            "name": "Ship trunk speed counter",
            "shortDescription": "Max speed of ship predictor.",
            "fullDescription": "Application which predicts possible max speed of ship.",
            "rate": 3,
            "authorId": 1,
            "authorFullName": "John Brown",
            "icon": "",
            "keywords": [
                "ship",
                "speed",
                "trunk"
            ],
            "lastUpdateDate": "2010-07-03T00:00:00",
            "timesUsed": 300,
            "openSource": False,
            "releases": [
                {
                    "id": 102,
                    "computationApplicationId": 2,
                    "version": "v1.0",
                    "fullDescription": "Application which predicts possible max speed of ship.",
                    "available": True,
                    "authorId": 1,
                    "parentId": 57,
                    "authorName": "John Brown",
                    "assetId": 17,
                    "releaseDate": "2010-07-03T00:00:00",
                    "usageCounter": 4,
                    "openSource": False,
                    "private": False
                }
            ]
        })
        app4_id = self.add_app({
            "forkId": 5,
            "name": "Economic growth predictor.",
            "shortDescription": "Economic growth predictor let you predict economic growth in your country.",
            "fullDescription": "Economic growth predictor let you predict economic growth in your country by lots of parameters.",
            "rate": 4,
            "authorId": 4,
            "authorFullName": "Postgres Bachamow",
            "icon": "",
            "keywords": [
                "economic",
                "growth",
                "count"
            ],
            "lastUpdateDate": "2017-07-03T00:00:00",
            "timesUsed": 600,
            "openSource": True,
            "releases": [
                {
                    "id": 124,
                    "computationApplicationId": 3,
                    "version": "v1.0",
                    "fullDescription": "Economic growth predictor let you predict economic growth in your country.",
                    "available": True,
                    "authorId": 4,
                    "parentId": 7,
                    "authorName": "Postgres Bachamow",
                    "assetId": 17,
                    "releaseDate": "2017-07-03T00:00:00",
                    "usageCounter": 10,
                    "openSource": False,
                    "private": False
                }
            ]
        })
        app5_id = self.add_app({
            "forkId": 12,
            "name": "Trebuchet range.",
            "shortDescription": "Count possible trebuchet range.",
            "fullDescription": "Application using advanced neural networks to predict trebuchet range and show you how to improve your results.",
            "rate": 6,
            "authorId": 10,
            "authorFullName": "Leon Icniv",
            "icon": "",
            "keywords": [
                "trebuchet",
                "range",
                "neural networks"
            ],
            "lastUpdateDate": "2018-03-03T00:00:00",
            "timesUsed": 100,
            "openSource": True,
            "releases": [
                {
                    "id": 114,
                    "computationApplicationId": 4,
                    "version": "v1.0",
                    "fullDescription": "Application using advanced neural networks to predict trebuchet range and show you how to improve your results.",
                    "available": True,
                    "authorId": 8,
                    "parentId": 9,
                    "authorName": "Leon Icniv",
                    "assetId": 15,
                    "releaseDate": "2018-08-03T00:00:00",
                    "usageCounter": 12,
                    "openSource": True,
                    "private": False
                }
            ]
        })

        self.add_app_to_shelf(self.get_app(str(app1_id)))
        self.add_app_to_shelf(self.get_app(str(app2_id)))

        task1_id = self.add_task({
            "userId": 15,
            "status": "finished",
            "computationApplicationReleaseId": 4141,
            "jobList":[],
            "progress": 100,
            "reservedCredits": 76.3,
            "estimatedCredits": 55.3,
            "consumedCredits": 10.7,
            "startTime": "2019-12-23T19:59:48.2937583+00:00",
            "endTime": "2019-12-23T20:01:48.2937583+00:00",
            "priority": 4,
            "isPrivate": False,
            "safeMode": False
        })
        task2_id = self.add_task({
            "userId": 15,
            "status": "finished",
            "computationApplicationReleaseId": 125,
            "jobList": [],
            "progress": 100,
            "reservedCredits": 92.3,
            "estimatedCredits": 70.3,
            "consumedCredits": 54.3,
            "startTime": "2019-12-23T21:00:49.294517+00:00",
            "endTime": "2019-12-23T21:02:49.294517+00:00",
            "priority": 3,
            "isPrivate": True,
            "safeMode": True
    })
        task3_id = self.add_task({
            "userId": 15,
            "status": "finished",
            "computationApplicationReleaseId": 127,
            "jobList": [],
            "progress": 100,
            "reservedCredits": 52.1,
            "estimatedCredits": 43.6,
            "consumedCredits": 50.1,
            "startTime": "2019-12-23T21:00:32.2945218+00:00",
            "endTime": "2019-12-23T21:02:32.2945218+00:00",
            "priority": 0,
            "isPrivate": True,
            "safeMode": True
    })

        cluster1_id = self.add_cluster(
            {"name": "MyCluster1", "status":"available", "endpoint":"185.23.162.184", "country":"LV", "machines":4,
             "availability":[]})

        job1_id = self.add_job({
                    "name": "Volume counter",
                    "computationTaskId": str(task1_id),
                    "computationModuleReleaseId": "v1.0",
                    "computationModuleName": "volume counter",
                    "clusterId": str(cluster1_id),
                    "progress": 0,
                    "status": "finished",
                    "startTime": "2019-12-22T23:23:49.2941482+00:00",
                    "endTime": "2019-12-23T20:55:49.2941829+00:00",
                    "reservedCredits": 200,
                    "estimatedCredits": 180,
                    "usedCredits": 0,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "20",
                        "machineId": "baltic4"
                    },
                    {
                        "resourceType": "CPU",
                        "value": "31",
                        "machineId": "baltic4"
                    },
                    {
                        "resourceType": "RAM",
                        "value": "66",
                        "machineId": "baltic4"
                    }
                    ]
                })
        job2_id = self.add_job({
                    "name": "Median Counter",
                    "computationTaskId": str(task1_id),
                    "computationModuleReleaseId": "v1.0",
                    "computationModuleName": "median counter",
                    "clusterId": str(cluster1_id),
                    "progress": 64.25,
                    "status": "finished",
                    "startTime": "2019-12-23T20:13:49.2944792+00:00",
                    "endTime": "2019-12-23T20:55:49.2944806+00:00",
                    "reservedCredits": 150,
                    "estimatedCredits": 128,
                    "usedCredits": 90,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "10",
                        "machineId": "baltic4"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "12",
                        "machineId": "baltic4"
                    },
                    {
                        "resourceType": "CPU",
                        "value": "8",
                        "machineId": "baltic6"
                    }
                    ]
                })
        job3_id = self.add_job({
                    "name": "neural network",
                    "computationTaskId": str(task1_id),
                    "computationModuleReleaseId": "v2.0",
                    "computationModuleName": "convolutional neural network",
                    "clusterId": str(cluster1_id),
                    "progress": 100,
                    "status": "finished",
                    "startTime": "2019-12-23T14:35:49.2944819+00:00",
                    "endTime": "2019-12-23T20:55:49.2944822+00:00",
                    "reservedCredits": 210,
                    "estimatedCredits": 195,
                    "usedCredits": 200,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "18",
                        "machineId": "baltic4"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "16",
                        "machineId": "baltic5"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "10",
                        "machineId": "baltic6"
                    }
                    ]
                })
        job4_id = self.add_job({
                    "name": "PI counter",
                    "computationTaskId": str(task2_id),
                    "computationModuleReleaseId": "v1.0",
                    "computationModuleName": "PI counter",
                    "clusterId": str(cluster1_id),
                    "progress": 100,
                    "status": "finished",
                    "startTime": "2019-12-23T16:23:49.2945184+00:00",
                    "endTime": "2019-12-23T20:54:49.2945187+00:00",
                    "reservedCredits": 180,
                    "estimatedCredits": 175,
                    "usedCredits": 150,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "48",
                        "machineId": "baltic12"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "32",
                        "machineId": "baltic13"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "60",
                        "machineId": "baltic14"
                    }
                    ]
                })
        job5_id = self.add_job({
                    "name": "Neural network",
                    "computationTaskId": str(task2_id),
                    "computationModuleReleaseId": "v2.2",
                    "computationModuleName": "Deep learning neural network",
                    "clusterId": str(cluster1_id),
                    "progress": 0,
                    "status": "finished",
                    "startTime": "2019-12-23T19:35:49.2945198+00:00",
                    "endTime": "2019-12-23T20:48:49.29452+00:00",
                    "reservedCredits": 0,
                    "estimatedCredits": 180,
                    "usedCredits": 0,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "CPU",
                        "value": "85",
                        "machineId": "baltic1"
                    },
                    {
                        "resourceType": "CPU",
                        "value": "90",
                        "machineId": "baltic2"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "40",
                        "machineId": "baltic2"
                    }
                    ]
                })
        job6_id = self.add_job({
                    "name": "Genetic algorithm",
                    "computationTaskId": str(task2_id),
                    "computationModuleReleaseId": "v3.2",
                    "computationModuleName": "Genetic Traveling Salesman Problem solving module",
                    "clusterId": str(cluster1_id),
                    "progress": 64.1,
                    "status": "finished",
                    "startTime": "2019-12-23T19:23:49.2945208+00:00",
                    "endTime": "2019-12-23T19:55:49.294521+00:00",
                    "reservedCredits": 320,
                    "estimatedCredits": 250,
                    "usedCredits": 240,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "65",
                        "machineId": "baltic1"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "46",
                        "machineId": "baltic2"
                    },
                    {
                        "resourceType": "CPU",
                        "value": "90",
                        "machineId": "baltic2"
                    }
                    ]
                })
        job7_id = self.add_job({
                    "name": "Material thermal conduction",
                    "computationTaskId": str(task3_id),
                    "computationModuleReleaseId": "v.2.3",
                    "computationModuleName": "Thermal mapping",
                    "clusterId": str(cluster1_id),
                    "progress": 44.4,
                    "status": "pending",
                    "startTime": "0001-01-01T00:00:00",
                    "endTime": "0001-01-01T00:00:00",
                    "reservedCredits": 102,
                    "estimatedCredits": 42,
                    "usedCredits": 12,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "34",
                        "machineId": "4"
                    },
                    {
                        "resourceType": "CPU",
                        "value": "22",
                        "machineId": "4"
                    },
                    {
                        "resourceType": "RAM",
                        "value": "21",
                        "machineId": "4"
                    }
                    ]
                })
        job8_id = self.add_job({
                    "name": "Particle swarm optimization",
                    "computationTaskId": str(task3_id),
                    "computationModuleReleaseId": "44",
                    "computationModuleName": "Particle logic creating",
                    "clusterId": str(cluster1_id),
                    "progress": 34.2,
                    "status": "pending",
                    "startTime": "0001-01-01T00:00:00",
                    "endTime": "0001-01-01T00:00:00",
                    "reservedCredits": 220,
                    "estimatedCredits": 200,
                    "usedCredits": 65,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "CPU",
                        "value": "34",
                        "machineId": "1"
                    },
                    {
                        "resourceType": "GPU",
                        "value": "22",
                        "machineId": "1"
                    },
                    {
                        "resourceType": "RAM",
                        "value": "35",
                        "machineId": "1"
                    }
                    ]
                })
        job9_id = self.add_job({
                    "name": "Path finding",
                    "computationTaskId": str(task3_id),
                    "computationModuleReleaseId": "v.2.2",
                    "computationModuleName": "Genetics evaluating",
                    "clusterId": str(cluster1_id),
                    "progress": 54.2,
                    "status": "pending",
                    "startTime": "0001-01-01T00:00:00",
                    "endTime": "0001-01-01T00:00:00",
                    "reservedCredits": 150,
                    "estimatedCredits": 100,
                    "usedCredits": 33,
                    "resourceUsageMetrics": [
                    {
                        "resourceType": "GPU",
                        "value": "44",
                        "machineId": "2"
                    },
                    {
                        "resourceType": "CPU",
                        "value": "98",
                        "machineId": "2"
                    },
                    {
                        "resourceType": "RAM",
                        "value": "32",
                        "machineId": "2"
                    }
                    ]
                })

    def add_app(self, app):
        self._last_app_id += 1
        app["id"] = str(self._last_app_id)
        self.apps[str(self._last_app_id)] = app
        return self._last_app_id

    def add_task(self, task):
        self._last_task_id += 1
        task["id"] = str(self._last_task_id)
        self.tasks[str(self._last_task_id)] = task
        return str(self._last_task_id)

    def add_job(self, job):
        self._last_job_id += 1
        job["id"] = str(self._last_job_id)
        self.jobs[str(self._last_job_id)] = job
        return self._last_job_id

    def add_cluster(self, cluster):
        self._last_cluster_id += 1
        cluster["id"] = str(self._last_cluster_id)
        self.clusters[str(self._last_cluster_id)] = cluster
        return self._last_cluster_id

    def activate_task(self, task_id):
        if task_id in self.tasks:
            self.tasks[task_id]["status"] = "running"
            # create a job for this task
            self.add_job({
                "clusterId": "1",
                "computationModuleName": "SEC_HULL",
                "computationModuleReleaseId": "v1.0",
                "computationTaskId": str(task_id),
                "estimatedCredits": 22.3,
                "name": "Section the hull",
                "progress": 13.5,
                "reservedCredits": 50,
                "resourceUsageMetrics": [],
                "startTime": datetime.datetime.now(),
                "status": "running",
                "usedCredits": 2
            })
            self.add_job({
                "clusterId": "1",
                "computationModuleName": "OPT_HULL",
                "computationModuleReleaseId": "v1.0",
                "computationTaskId": str(task_id),
                "estimatedCredits": 22.3,
                "name": "Optimize the hull",
                "progress": 0,
                "reservedCredits": 50,
                "resourceUsageMetrics": [],
                "startTime": datetime.datetime.now(),
                "status": "running",
                "usedCredits": 2
            })


    def delete_app(self, app_id):
        if app_id in self.apps:
            del self.apps[app_id]

    def get_app(self, app_id):
        app = self.apps.get(app_id)
        return app

    def get_task(self, task_id):
        task = self.tasks.get(task_id)
        return task

    def get_job(self, job_id):
        job = self.jobs.get(job_id)
        return job

    def get_cluster(self, cluster_id):
        cluster = self.clusters.get(cluster_id)
        return cluster

    def get_apps(self):
        return list(self.apps.values())

    def get_tasks(self):
        return list(self.tasks.values())

    def get_jobs(self):
        return list(self.jobs.values())

    def get_clusters(self):
        return list(self.clusters.values())

    def get_task_jobs(self, task_id):
        return list(filter(lambda x: x["computationTaskId"] == task_id, list(self.jobs.values())))

    def get_shelf(self):
        return self.shelf

    def add_app_to_shelf(self, app):
        #app["date_added_to_shelf"] = datetime.datetime.now()
        self.shelf.append(app)

    def delete_task(self, task_id):
        if task_id in self.tasks:
            del self.tasks[task_id]
            for job in list(filter(lambda x: x["computationTaskId"] == task_id, list(self.jobs.values()))):
                self.delete_job(job["id"])

    def delete_job(self, job_id):
        if job_id in self.jobs:
            del self.jobs[job_id]

    def finish_task(self, task_id):
        self.tasks[task_id]["status"] = "finished"
        self.tasks[task_id]["progress"] = 100
        self.tasks[task_id]["consumedCredits"] = self.tasks[task_id]["estimatedCredits"] + random.randint(-10,10)
        self.tasks[task_id]["endTime"] = datetime.datetime.now()
        for job in list(filter(lambda x: x["computationTaskId"] == task_id, list(self.jobs.values()))):
            self.jobs[job["id"]]["progress"] = 100
            self.jobs[job["id"]]["status"] = "finished"
            self.jobs[job["id"]]["endTime"] = datetime.datetime.now()