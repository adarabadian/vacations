import axios from "axios";

// get all vacations from server function
export const getAllVacationsFromServer = async () => {
    try {
        let token = sessionStorage.getItem("token");
        axios.defaults.headers.common['authorization'] = "Bearer " +  token;
        
        const response = await axios.get("https://adar-vacations.herokuapp.com/vacations");
        const allVacations = response.data;

        return allVacations;
    }

    catch(error){
        return error;
    }
}