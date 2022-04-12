import axios from 'axios';
import utils from "./utils"
import { _ } from 'vue-underscore';

let ajax = axios.create();

ajax.interceptors.request.use(function (config) {

	// Do something before request is sent
	const header = utils.methods.getHeader();
	_.extend(config, header);

	if (!window.resetToken) {
		window.resetToken = true;
        setInterval(function() {

        	const last_seen = new Date(localStorage.getItem("last_seen"))
        	const current_time = new Date();

        	// if user's last action was more than 10 min ago, we don't reset token
        	if (current_time - last_seen < 1000 * 60 * 10) {
	            const backend = process.env.VUE_APP_SERVER_URL;
	            axios.get(backend + "Login/UpdateSession", utils.methods.getHeader())
	                    .then(response => {
	                        if (utils.methods.noErrorsInResponse(response)) {
	                            const new_token = response.data.data.token;
	                            
	                            localStorage.setItem("token", new_token);
	                            localStorage.setItem("token_last_updated", new Date());
	                        }
	                    });
	        }


        }, 1000 * 60 * 20); //20 min
    }

    localStorage.setItem("last_seen", new Date());

	return config;
}, function (error) {
	// Do something with request error
	console.error("in error ", error)

	let originalRequest = error.config;
	if (error.response.status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;

		const new_header = utils.methods.getHeader();
		_.extend(originalRequest, new_header);

		return ajax(originalRequest);
	}
	else {
		utils.methods.processErrorInPromise(error)
		return Promise.reject(error);
	}
});

export default ajax;


