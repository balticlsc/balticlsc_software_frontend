import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore'
import utils from '../../utils/utils'

export default {
    mixins:[mymixin, utils],
    data: function() {
        return {
            email: null,
            password: null,
        };
    },

    mounted: function() {
        var self = this;
        $("#email").focus();
        window.addEventListener('keyup', event => {
            if (event.keyCode === 13 && $("#email").length == 1) {
                self.login(event);
            }
        });

        if (this.$route.query.demo == "true") {
            this.demo_login();
        }
    },

    methods: {
        demo_login() {
            var self = this;

            var backend = this.SERVER_URL();
           
            var email = "demo";
            var password = "BalticDemo";

            axios.post(backend + "Login", {"username": email, "password": password})
                .then(response => {

                    if (self.noErrorsInResponse(response)) {

                        var token = response.data.data.token;

                        localStorage.setItem("token", token);
                        localStorage.setItem("user", email);

                        self.$router.push('/store');
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error, false);
                });
        },
        // eslint-disable-next-line no-unused-vars
        login(ev) {
            var self = this;

            console.log("aaa")

            var backend = this.SERVER_URL();
            console.log("Backend:"+backend);
            console.log("Real Backend:"+this.REAL_SERVER_URL());
            var email = $("#email").val();
            var password = $("#password").val();

            axios.post(backend + "Login", {"username": email, "password": password})
                .then(response => {

                    if (self.noErrorsInResponse(response)) {

                        var token = response.data.data.token;

                        localStorage.setItem("token", token);
                        localStorage.setItem("user", email);
                        // localStorage.setItem("token_last_updated", new Date());

                        self.$router.push('/store');
                    }
                })
                .catch(error => {
                    self.processErrorInPromise(error, false);
                });
        },


        track () {
            console.log("in track")
            this.$ga.page('/')
        }

    }
}
