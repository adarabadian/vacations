const vacationsDao = require("../dao/vacationsDao");
const usersServerCache = require("../models/usersServerCache");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

// get user token from request headers and remove bearer 
const getUserToken = (request) =>{
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);
    return token;
}


// get AllVacations from DB
const getAllVacations = async (request) => {
    const token = getUserToken(request);

    // get user data from server cache by its token
    let userData = usersServerCache.get(token);
    
    let userId = userData.userId;

    // callback for vacationsDao > get all vacations function
    const allVacations = await vacationsDao.getAllVacations(userId);

    const hostUrl = "https://adar-vacations.herokuapp.com/";

    // loop through vacations array and set user likes and attach host url to picture for each one
    for (vacation of allVacations) {
        if (vacation.userId != userId) {
            vacation.isLiked = false
        } 
        else {
        vacation.isLiked = true
        }

        vacation.picture = hostUrl + vacation.picture;
    }

    // return all vacations back to vacations controller
    return allVacations;
}


const addToFavorites = async (vacationId, request)=>{
    const token = await getUserToken(request);
    let userDetails = usersServerCache.get(token);
    let userId = userDetails.userId;

    // callback for vacationsDao > addToFavorites
    await vacationsDao.addToFavorites(userId, vacationId);
}


const removeFromFavorites = async (vacationId, request)=>{
    const token = await getUserToken(request);
    let userDetails = usersServerCache.get(token);
    let userId = userDetails.userId;
    
    // callback for vacationsDao > removeFromFavorites
    await vacationsDao.removeFromFavorites(userId, vacationId);
}


const addNewVacation = async(vacation, request) =>{
    const token = await getUserToken(request);
    let userDetails = usersServerCache.get(token);
    
    // if user isnt admin throw new error
    let userType = userDetails.userType;
    if (userType !== "ADMIN"){
        throw new ServerError(ErrorType.INSUFFICIENT_PRIVILEGES);
    } 
    
    const hostUrl = "https://adar-vacations.herokuapp.com/";
    vacation.picture = vacation.picture.slice(hostUrl.length, vacation.picture.length);

    // callback for vacationsDao > add new vacation
    let response = await vacationsDao.addNewVacation(vacation);

    // return the id of the new row from db
    return response.insertId;
}


const deleteVacation = async(vacationId, request) =>{
    const token = await getUserToken(request);
    let userDetails = usersServerCache.get(token);

    // if user isnt admin throw new error
    let userType = userDetails.userType;
    if (userType !== "ADMIN"){
        throw new ServerError(ErrorType.INSUFFICIENT_PRIVILEGES);
    } 
    
    // callback for vacationsDao > deleteVacation, it returns the picture need to delete
    let pictureForDelete = await vacationsDao.deleteVacation(vacationId);

    // picture to delete returns to controller and then it deletes the photo
    return pictureForDelete;
}


const editVacation = async(vacation, request) =>{
    const token = await getUserToken(request);
    let userDetails = usersServerCache.get(token);

    // if user isnt admin throw new error
    let userType = userDetails.userType;
    if (userType !== "ADMIN"){
        throw new ServerError(ErrorType.INSUFFICIENT_PRIVILEGES);
    } 

    // remove the hosturl before saving it on db
    const hostUrl = "https://adar-vacations.herokuapp.com/";
    vacation.picture = vacation.picture.slice(hostUrl.length, vacation.picture.length);

    await vacationsDao.editVacation(vacation);
}

module.exports = {
    getAllVacations,
    addToFavorites,
    removeFromFavorites,
    addNewVacation,
    deleteVacation,
    editVacation
}