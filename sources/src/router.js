import Vue from "vue";
import Router from "vue-router";

// eslint-disable-next-line no-unused-vars
import Login from "./mycomponents/Login/Login.vue"; 
// eslint-disable-next-line no-unused-vars
import Register from "./mycomponents/RegisterUser/RegisterUser.vue";
import AppStore from "./mycomponents/AppStore/AppStore.vue";
import AppDetails from "./mycomponents/AppDetails/AppDetails.vue";
import ComputationApplication_Edit from   "./mycomponents/AppDetails/ComputationApplication_Edit/ComputationApplication_Edit.vue";
import ComputationApplicationRelease_Edit from   "./mycomponents/AppDetails/ComputationApplicationRelease_Edit/ComputationApplicationRelease_Edit.vue";
import AppShelf from "./mycomponents/AppShelf/AppShelf.vue";
import TaskDetails from "./mycomponents/TaskDetails/TaskDetails.vue";
import Jobs from "./mycomponents/Jobs/Jobs.vue";
import JobDetails from "./mycomponents/JobDetails/JobDetails.vue";
import Profile from "./mycomponents/Profile/Profile.vue";
import ResourcesShelf from "./mycomponents/ResourcesShelf/ResourcesShelf.vue";
import DataShelf from "./mycomponents/DataShelf/DataShelf.vue";
import ResourcesCredits from "./mycomponents/ResourcesCredits/ResourcesCredits.vue";
import ClusterMachines from "./mycomponents/ClusterMachines/ClusterMachines.vue";
import Benchmarks from "./mycomponents/Benchmarks/Benchmarks.vue";
import BenchmarkDetails from "./mycomponents/BenchmarkDetails/BenchmarkDetails.vue";
import ComputationModules from "./mycomponents/ComputationModules/ComputationModules.vue";
import ComputationApplications from "./mycomponents/ComputationApplications/ComputationApplications.vue";
import ComputationModule from "./mycomponents/ComputationModule/ComputationModule.vue";
import ComputationModule_Edit from "./mycomponents/ComputationModule/ComputationModule_Edit/ComputationModule_Edit.vue"
import ComputationModuleRelease_Edit from "./mycomponents/ComputationModule/ComputationModuleRelease_Edit/ComputationModuleRelease_Edit.vue"
import ComputationApplication from "./mycomponents/ComputationApplication/ComputationApplication.vue";
import ComputationApplicationReadOnly from "./mycomponents/ComputationApplicationReadOnly/ComputationApplicationReadOnly.vue";
import AdminPanel from "./mycomponents/AdminPanel/AdminPanel.vue";
import Person from "./mycomponents/Person/Person.vue";



Vue.use(Router);

export default new Router({
  routes: [

    {
      path: "/",
      name: "Login",
      meta: {layout: "no-bars"},
      component: require("@/mycomponents/Login/Login.vue").default,
      // component: Login
    },

    {
      path: "/register",
      name: "Register",
      meta: {layout: "no-bars"},
      component: require("@/mycomponents/RegisterUser/RegisterUser.vue").default,
      // component: Login
    },

    {
      path: "/store",
      name: "AppStore",
      component: AppStore,
      meta: {requiresAuth: true},
    },

    {
      path: "/app/:id",
      name: "AppDetails",
      component: AppDetails,
      meta: {requiresAuth: true},
    },

    {
      path: "/app-edit/:id",
      name: "ComputationApplication_Edit",
      component: ComputationApplication_Edit,
      meta: {requiresAuth: true},
    },

    {
      path: "/app-release-edit/:id",
      name: "ComputationApplicationRelease_Edit",
      component: ComputationApplicationRelease_Edit,
      meta: {requiresAuth: true},
    },
    
    {
      path: "/app-shelf",
      name: "AppShelf",
      component: AppShelf,
      meta: {requiresAuth: true},
    },

    {
      path: "/task/:id",
      name: "TaskDetails",
      component: TaskDetails,
      meta: {requiresAuth: true},
    },

    {
      path: "/jobs",
      name: "Jobs",
      component: Jobs,
      meta: {requiresAuth: true},
    },

    {
      path: "/job/:id",
      name: "JobDetails",
      component: JobDetails,
      meta: {requiresAuth: true},
    },

    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: {requiresAuth: true},
    },

    {
      path: "/resources-shelf",
      name: "ResourcesShelf",
      component: ResourcesShelf,
      meta: {requiresAuth: true},
    },

    {
      path: "/data-shelf",
      name: "DataShelf",
      component: DataShelf,
      meta: {requiresAuth: true},
    },

    {
      path: "/cluster-machines/:clusterId",
      name: "ClusterMachines",
      component: ClusterMachines,
      meta: {requiresAuth: true},
    },

    {
      path: "/benchmarks/:clusterId",
      name: "Benchmarks",
      component: Benchmarks,
      meta: {requiresAuth: true},
    },

    {
      path: "/benchmark-details/:benchmarkId",
      name: "BenchmarkDetails",
      component: BenchmarkDetails,
      meta: {requiresAuth: true},
    },

    {
      path: "/resources-credits/:clusterId",
      name: "ResourcesCredits",
      component: ResourcesCredits,
      meta: {requiresAuth: true},
    },

    {
      path: "/computation-modules",
      name: "ComputationModules",
      component: ComputationModules,
      meta: {requiresAuth: true},
    },

    {
      path: "/development-shelf",
      name: "DevelopmentShelf",
      component: ComputationApplications,
      meta: {requiresAuth: true},
    },

    {
      path: "/computation-module/:moduleId",
      name: "ComputationModule",
      component: ComputationModule,
      meta: {requiresAuth: true},
    },

    {
      path: "/computation-module-edit/:moduleId",
      name: "ComputationModule_Edit",
      component: ComputationModule_Edit,
      meta: {requiresAuth: true},
    },

    {
      path: "/computation-module-release-edit/:moduleReleaseId",
      name: "ComputationModuleRelease_Edit",
      component: ComputationModuleRelease_Edit,
      meta: {requiresAuth: true},
    },


    {
      path: "/computation-application/:applicationId",
      name: "ComputationApplication",
      component: ComputationApplication,
      meta: {requiresAuth: true},
    },

    {
      path: "/computation-application-version/:applicationId",
      name: "ComputationApplicationReadOnly",
      component: ComputationApplicationReadOnly,
      meta: {requiresAuth: true},
    },

    {
      path: "/admin-panel",
      name: "AdminPanel",
      component: AdminPanel,
      meta: {requiresAuth: true},
    },

    {
      path: "/person/:personId",
      name: "Person",
      component: Person,
      meta: {requiresAuth: true},
    },

  ]

});
