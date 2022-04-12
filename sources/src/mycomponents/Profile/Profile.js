import { mymixin } from '../mixins/mixins.js'
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'
    
export default {
    mixins:[mymixin, utils],
    methods: {            
        changePassword: function() {
            var self = this;

            //var password1 = $("#password").val();
            var password2 = $("#password2").val();
            var password3 = $("#password3").val();

            // need a msg
            if (password2 != password3) {
                self.addNotification("The new password and the repeated password do not match!", "error");
                console.error("Passwords do not match");
                return;
            }

            var list = {userName: self.getUsername(),
                        oldPassword: $("#password").val(),
                        newPassword: $("#password2").val(),
                    };

            blsc_axios.post(this.SERVER_URL() + "Login/ChangePassword", list)
                    .then(response => {

                        console.log("resp ", response)

                        if (self.noErrorsInResponse(response)) {
                            self.addNotification("The password has been successfully changed!");
                        }

                    });
        },
    }
}