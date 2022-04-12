import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import blsc_axios from '../../utils/axios'
    
export default {
    mixins:[mymixin, utils],
    methods: {
        // eslint-disable-next-line no-unused-vars
        register: function(ev) {
            var self = this;

            console.log("register");

            //var user_name = $("#user").val();
            var password1 = $("#password").val();
            var password2 = $("#password2").val();

            if (password1 != password2) {
                
                // error msg needed
                console.error("Password1 and password2 do not mathc");

                return;
            }


            var list = {emailAddress: $("#email").val(),
                        username: $("#username").val(),
                        password: password1,
                        status: 1,
                    };


            console.log("list ", list)

            blsc_axios.post(this.SERVER_URL() + "Login/CreateUser", list)
                    .then(response => {

                        console.log("resp ", response)

                        if (self.noErrorsInResponse(response)) {
                            self.$router.push('/');
                        }
                    });
        },
    }
}
