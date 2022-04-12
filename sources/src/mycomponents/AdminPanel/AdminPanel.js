import { mymixin } from '../mixins/mixins.js'
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'
    
export default {
    mixins:[mymixin, utils],


    data: function() {
        return {
            users: [
                    // {id: "a1", nr: 1, userName: "A1", email: "aa1@blsc.com", status: 1,},
                    // {id: "a2", nr: 2, userName: "A2", email: "aa2@blsc.com", status: 1,},
                    // {id: "a3", nr: 3, userName: "A3", email: "aa3@blsc.com", status: 1,},
                    // {id: "a4", nr: 4, userName: "A4", email: "aa4@blsc.com", status: 1,},
                ],
        };
    },

    methods: {            
        createUser: function() {
            var self = this;

            var password1 = $("#new-user-password1").val();
            var password2 = $("#new-user-password2").val();
            if (password1 != password2) {                
                // error msg needed
                console.error("Password1 and password2 do not match");
                self.addNotification("Password1 and password2 do not match");

                return;
            }

            var list = {emailAddress: $("#new-user-email").val(),
                        username: $("#new-user-username").val(),
                        password: password1,
                        status: 1,
                    };


            console.log("list ", list)

            blsc_axios.post(this.SERVER_URL() + "Login/CreateUser", list)
                    .then(response => {
                        console.log("resp ", response)

                        if (self.noErrorsInResponse(response)) {
                            var data = response.data.data;
                            self.addNotification("New user added: " + JSON.stringify(data));
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });

            self.clearCreateWindow();
        },

        deleteUser: function() {
            console.log("delete user");
        },

        clearCreateWindow: function() {
            $("#new-user-username").val("");
            $("#new-user-email").val("");
            $("#new-user-password1").val("");
            $("#new-user-password2").val(""); 

        },

    }
}