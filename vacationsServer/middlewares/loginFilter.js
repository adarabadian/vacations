const expressJwt = require("express-jwt");
const config = require("../config.json");

let {secret} = config;

function authenticationJwtRequestToken(){
    return expressJwt({secret, algorithms: ["HS256"]}).unless({
        path:[
            "/users/register",
            "/users/login",
            "/users/isUserNameExists",
            "/users/logUserWithToken"
        ]
    })
} 
module.exports = authenticationJwtRequestToken;