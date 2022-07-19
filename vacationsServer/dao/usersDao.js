const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

// function that checks if username already exists
let isUserNameExists = async (userName) => {
    const SQL = "SELECT User_Name as userName FROM users WHERE User_Name =?";
    let parameters = [
        userName
    ];

    try {
        let isExist = await connection.executeWithParameters(SQL, parameters);
        return isExist;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


// login function
let login = async (userName, hashedPassword) => {
    
    const SQL = `SELECT User_Name as userName,
    User_Type as userType,
    User_Id as userId
    FROM users 
    WHERE User_Name =? and User_Password =?`;
    let parameters = [
        userName,
        hashedPassword
    ];
    
    try {
        let userLoginResult = await connection.executeWithParameters(SQL, parameters);
        return userLoginResult[0];
    }

    catch(error){
        throw new error;
    }
}


let register = async (userData) => {
    let SQL = "INSERT into users (User_Name, User_Password, User_First_Name, User_Last_Name) VALUES (?, ?, ?, ?)" 
    let parameters = [
        userData.userName,
        userData.password,
        userData.firstName,
        userData.lastName
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}


module.exports = {
    login,
    register,
    isUserNameExists
};