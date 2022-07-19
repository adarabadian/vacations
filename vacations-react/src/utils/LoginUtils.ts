import { Component } from 'react'
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';
import { toast } from 'react-toastify';




export default class LoginUtils extends Component {

    // function that updates redux store after login with username, user type, and sets the isLoggedIn variable to true
    static updateReduxStoreOnLogin = (userName:string, isLoggedIn:boolean, userType: string) => {
        store.dispatch({ type: ActionType.updateUserLoginStatus, payload: [userName, isLoggedIn, userType] });
    }

    // function that sets the user socket and return it
    static setUserSocket = () => {
        let socket = socketIOClient(window.location.hostname, { query: "token=" + sessionStorage.getItem("token")}).connect();
        store.dispatch({ type: ActionType.setUserSocket, payload: socket});
        return socket;
    }

    // log user out function
    static logOutUser = () => {
        // disconnect the socket
        let socket = store.getState().socket;
        socket.disconnect();

        // update redux store 
        store.dispatch({ type: ActionType.logOutUser, payload: false });
    }

    // function that handles with unlogged user that might have token
    static handleUnloggedUser = async () =>{
        let token = sessionStorage.getItem("token");
        
        if (token === null || token === "undefined"){
            return "exit";
        }
        else{
            await LoginUtils.loginWithToken(token);
        }
    }

    // function that tries log in with token only
    static loginWithToken = async (token: string) => {
        try {
            axios.defaults.headers.common['authorization'] = "Bearer " + token;
            const response =  await axios.post<SuccessfulLoginServerResponse>("https://adar-vacations.herokuapp.com/users/logUserWithToken");
            const serverResponse = response.data;

            toast.success("Welcome Back " + serverResponse.userName + "!")

            LoginUtils.updateReduxStoreOnLogin(serverResponse.userName, true, serverResponse.userType);

            LoginUtils.setUserSocket();
        }
        catch (err) {
            toast.error(err.response.data.error);
        }
    }

    // function that saves user details on session storage
    public static saveUserDetailsOnSession = (serverResponse: any) =>{
        sessionStorage.setItem("token", serverResponse.token);
        sessionStorage.setItem("userName", serverResponse.userName);
    }
}
