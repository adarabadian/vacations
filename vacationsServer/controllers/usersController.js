const express = require("express");
const router = express.Router();
const usersLogic = require("../logic/usersLogic");

router.post("/login", async(request, response, next) => {
    let userData = request.body;
    console.log(userData)
    
    try{
        // callback for userLogic > login function
        let successfullLoginData = await usersLogic.login(userData);

        // return successfullLoginData
        response.json(successfullLoginData);
    }
    catch(error){
        next(error);
    }
});

router.post("/register", async(request, response, next) => {
    let userData = request.body;
    
    try{
        // callback for userLogic > register function
        let successfullLoginData = await usersLogic.register(userData);

        // return successfullLoginData
        response.json(successfullLoginData);
    }
    catch(error){
        next(error);
    }
});


router.post("/isUserNameExists", async(request, response, next) => {
    let userName = request.body;
    
    try{
        // callback for userLogic > check if username already taken function
        let userNameResult = await usersLogic.isUserNameExists(userName);

        // return result gotted from userslogic
        response.json(userNameResult);
    }
    catch(error){
        next(error);
    }
});

router.post("/logOutUser", async(request, response, next) => {
    try{
        // callback for userLogic > log out user
        let result = await usersLogic.logOutUser(request);

        // return result
        response.json(result);
    }
    catch(error){
        next(error);
    }
});

router.post("/logUserWithToken", async(request, response, next) => {
    try{
        // callback for userLogic > log user in with token
        let successfullLoginData = await usersLogic.loginWithToken(request);
        
        // return successfullLoginData
        response.json(successfullLoginData);
    }
    catch(error){
        next(error);
    }
});


module.exports = router;
