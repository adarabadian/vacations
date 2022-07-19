const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

let getAllVacations = async (userId) => {
    const SQL =`SELECT  v.Vacation_ID as id,
    v.Vacation_Desc as description, 
    v.Vacation_Destination as destination, 
    v.Vacation_Picture as picture,
    DATE_FORMAT(v.Vacation_From_Date, '%d/%m/%Y') AS fromDate,
    DATE_FORMAT(v.Vacation_To_Date,'%d/%m/%Y') AS toDate,
    v.Vacation_Price as price,
    followed_vacations.User_Id AS userId, 

    (SELECT COUNT(*) FROM followed_vacations
    WHERE vacation_id = v.Vacation_Id) AS followersAmount 
    FROM vacations v 
    LEFT JOIN followed_vacations  ON v.Vacation_Id=followed_vacations.Vacation_Id && followed_vacations.User_Id=? 
    ORDER BY  followed_vacations.User_Id DESC`;

    let parameters = [
        userId
    ]
    try {
        const allVacations= await connection.executeWithParameters(SQL, parameters);
        return allVacations;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let addToFavorites = async (userId, vacationId) =>{
    const SQL =`INSERT INTO followed_vacations (User_Id, Vacation_Id)
    VALUES (?, ?)`;
    let parameters = [
        userId, 
        vacationId
    ];
    
    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let removeFromFavorites = async (userId, vacationId)=>{
    const SQL =`DELETE FROM followed_vacations 
    WHERE User_Id =? AND
    Vacation_Id =?`;
    let parameters = [
        userId, 
        vacationId
    ];
    
    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let addNewVacation = async (vacation)=>{
    let SQL = `INSERT INTO vacations 
    (Vacation_Desc, Vacation_Destination, Vacation_Picture, Vacation_From_Date, Vacation_To_Date, Vacation_Price) 
    VALUES (?, ?, ?, ?, ?, ?);`
    
    let parameters = [
        vacation.description,
        vacation.destination,
        vacation.picture,
        vacation.fromDate,
        vacation.toDate,
        vacation.price
    ];
    
    try {
        let response = await connection.executeWithParameters(SQL, parameters)
        return response;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}



let deleteVacation = async (vacationId)=>{
    let SQL = `SELECT Vacation_Picture FROM vacations WHERE Vacation_ID=?; 
               DELETE FROM followed_vacations WHERE Vacation_ID=?; 
               DELETE FROM vacations WHERE Vacation_ID=?`
               
    let parameters = [
        vacationId,
        vacationId,
        vacationId
    ];
    
    try {
        let pictureForDelete = await connection.executeWithParameters(SQL, parameters);
        return pictureForDelete[0][0].Vacation_Picture
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }

}


let editVacation = async (vacation)=>{

    let SQL = `UPDATE vacations
    SET Vacation_Desc = ?, Vacation_Destination = ?, Vacation_Picture = ?, Vacation_From_Date = ?, Vacation_To_Date = ?, Vacation_Price = ?
    WHERE Vacation_ID = ?;`;

    let parameters = [
        vacation.description,
        vacation.destination,
        vacation.picture,
        vacation.fromDate,
        vacation.toDate,
        vacation.price,
        vacation.id
    ];
    
    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }

}
module.exports = {
    getAllVacations,
    addToFavorites,
    removeFromFavorites,
    addNewVacation,
    deleteVacation,
    editVacation
};