This is Git repository for BalticLSC FrontEnd

In addition, to start the project you have to create .env file containing the backend url, for insance:

VUE_APP_SERVER_URL=localhost:8080

VUE_APP_REAL_SERVER_URL=https://185.23.163.212:5001

Two variables are used because BalticLSC backend has CORS policy switched off. 
In the development server the VUE_APP_SERVER_URL should refer to the URL where the front-end is accessible.
The VUE_APP_REAL_SERVER_URL is the actual URL of the BalticLSC backend.

In the production sever, just the VUE_APP_SERVER_URL is used and it should refer to the actual URL of the BalticLSC backend.