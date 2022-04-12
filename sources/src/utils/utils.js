// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import { EventBus } from '../mycomponents/event-bus.js';


export default {
  data: function() { return {
    modalNotification: null,
    }
  },
  methods: {
    processResponse(response) {
      console.log("response", response);
      return response.data; 
      // return response.data.response;
    },

    getToken() {    
      return localStorage.getItem("token");
    },

    getUsername() {    
      return localStorage.getItem("user");
    },

    getHeaderAuthorization() {
      var token = this.getToken();
      console.log("token", token)
      
      return "Bearer " + token;
    },

    getHeader() {
      return {
        headers: {
              Authorization: this.getHeaderAuthorization(),
              "content-type": "application/json"
            },
          };
    },
	
    TimeString(str) {
      var timestr = this.$moment(str).format("YYYY-MM-DD HH:mm:ss");
      return timestr == "0001-01-01 00:00:00" ? "" : timestr;
    },

    addNotification(msg, type_in, debug) {
      EventBus.$emit("add-notification", {msg: msg, type: type_in, debug: debug});
    },

    removeNotification(id) {
      EventBus.$emit("remove-notification", id);
    },

    removeAllNotifications() {
      EventBus.$emit("remove-all-notifications");
    },

    noErrorsInResponse(response, modal = false) {
      if (response.status == 200 && response.data.success != false) {
        return true;
      } else {
        var msg = "";
        var debug = "";
        if (response.status == 200) {
          debug = "Error in the "+response.config.url+" response! Status: 200 OK, but \""+response.data.message+"\"";
          msg = response.data.message
        } else {
          if (response.status == 400) {
            debug = "Error in the "+response.config.url+" response! Status: 400 BAD REQUEST, \""+response.data.message+"\"";
            msg = response.data.message
          } else {
            if (response.status == 500) {
              debug = "Error in the "+response.config.url+" response! Status: 500 INTERNAL SERVETR ERROR, \""+response.data.message+"\"";
              msg = response.data.message
            } else {
            debug = "Error in the "+response.config.url+" response! Status:"+response.status+", \""+response.statusText+"\"";
            msg = response.statusText
            }
          }
        }

        modal ? this.showModalMessage(msg, "error")
              : this.addNotification(msg,"error", debug); 
        return false;
      }
    },

    processErrorInPromise(error, modal = false) {
      var msg = ""; 
      var debug = "";
      if (error.response) {
         if (error.response.status == 400 && error.response.data) {
          debug = "Error in the "+error.response.config.url+" response! Status: 400 BAD REQUEST, \""+error.response.data.message+"\"";
          msg = error.response.data.message;
          } else {
          if (error.response.status == 500 && error.response.data) {
            debug = "Error in the "+error.response.config.url+" response! Status: 500 INTERNAL SERVER ERROR, \""+error.response.data.message+"\"";
            msg = error.response.data.message;
          } else {
            debug = "Error in the endpoint "+error.response.config.url+
            ". Status:"+error.response.status+" \""+error.response.statusText+"\". Data: \""+error.response.data+"\"";
            msg = error.response.statusText;  
          }
          }
      
         
         if (error.response.status == 401) {
               this.addNotification(msg, "error", debug);
               this.$router.push('/');
               return
         } 
      }
      else {
         msg = error;
         debug = error;
      }
      
      modal ? this.showModalMessage(msg, "error", debug) : this.addNotification(msg, "error", debug);
      
    },

    showModalMessage: function(msg, type_in, debug) {
      const types = {
        info: "info",
        error: "danger",
        warning: "warning",
      };
      var type = types[type_in] || "info";
      this.modalNotification = {msg: msg, type: "alert-"+type, debug: debug };
    },

    clearModalMessage: function() {
      this.modalNotification = null;
    }
  
  }
}
