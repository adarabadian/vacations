const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const usersDao = require("../dao/usersDao");
const usersServerCache = require("../models/usersServerCache");
const config = require ("../config.json");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");


let login = async(userData, isLoginAfterRegistration) =>  {

    // hash the password only in case of normal login, if just registered then dont hash.
    if (!isLoginAfterRegistration){
        validateUserParmLengths(userData, false);

        userData.password = createHashPassword(userData.password);
    }
    
    // callback to dao login function
    let successfullLoginData = await usersDao.login(userData.userName, userData.password);
    
    if (successfullLoginData == undefined){
        throw new ServerError(ErrorType.WRONG_USERNAME_OR_PASSWORD);
    }

    // if usersDao succeeded then start creating token for the user
    let saltedUserName = "ii4msat" + successfullLoginData.userName + "77DopeE";

    // creating token from salted username
    let token = jwt.sign({sub:saltedUserName}, config.secret);

    // create user cache to save on server cache
    let userCachedData = {
        userType: successfullLoginData.userType,
        userName: successfullLoginData.userName,
        userId: successfullLoginData.userId
    }

    // save the user's token and data at server's cache to reach it faster than from DB
    usersServerCache.set(token, userCachedData);

    // create login response to send to the client
    let successfullLoginResponse = {
        token: token,
        userType: successfullLoginData.userType,
        userName: successfullLoginData.userName
    }
    
    // return successfull login response to usersController
    return successfullLoginResponse;
};




let register = async (userRegistrationDetails) => {
    validateUserParmLengths(userRegistrationDetails, true);

    // if username exists return
    let isExist = await usersDao.isUserNameExists(userRegistrationDetails.userName);

    if (isExist.length !== 0){
        throw new ServerError(ErrorType.USERNAME_ALREADY_EXISTS);
    }

    let hashedPassword = createHashPassword(userRegistrationDetails.password);
    
    // replace user's password with hashed password
    userRegistrationDetails.password = hashedPassword;
    
    // callback to usersDao register function and wait for response
    await usersDao.register(userRegistrationDetails);
    
    // if register succeeded then log the user in with login function
    let registerDetails = {
        userName: userRegistrationDetails.userName,
        password: hashedPassword
    }

    // login the user
    let successfullLoginResponse = await login(registerDetails, true);

    return successfullLoginResponse;
}


// hashing password
const createHashPassword = (password) => {
    let saltedPassword = "a36w5gr%wA($oaj" + password + "(&#DE5JS4#%$@";
    let hashedPassword = crypto.createHash("md5").update(saltedPassword).digest("hex");

    return hashedPassword;
}

const validateUserParmLengths= (user, isRegister) =>{
    // validate user parameters length 
    if (user.userName.length < 3 || user.userName.length > 12 ||
        user.password.length < 6 || user.password.length > 12){
        throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
    }
    // in case its after register needs to validate firstName and lastName as well 
    if (isRegister){
        if (user.firstName.length < 2 || user.firstName.length > 12 ||
            user.lastName.length < 2 || user.lastName.length > 12){
            throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
        }
    }
}

const isUserNameExists = async (userName) =>{
    let isExist = await usersDao.isUserNameExists(userName.userName);

    if (isExist.length !== 0){
        throw new ServerError(ErrorType.USERNAME_ALREADY_EXISTS);
    }
    return ("This username is free to use");
}


const logOutUser = async (request) =>{
    // log out user by deleting its token from server's cache
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);

    usersServerCache.delete(token);
}



const loginWithToken = async (request) =>{
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);
    
    let successfullLoginResponse = usersServerCache.get(token);

    return successfullLoginResponse;
}


module.exports = {
    login, 
    register,
    isUserNameExists,
    logOutUser,
    loginWithToken
};
