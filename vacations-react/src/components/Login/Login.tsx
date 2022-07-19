import React, { ChangeEvent, Component } from 'react';
import axios from "axios"
import {NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import "../Register/Register.css";
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { SuccessfulLoginServerResponse } from '../../models/SuccessfulLoginServerResponse';
import { toast } from 'react-toastify';
import  LoginUtils  from '../../utils/LoginUtils';

interface LoginState {
    userName: string,
    password: string
}

export default class Login extends Component <any, LoginState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            userName : "",
            password : ""
        };
    }
    
    
    async componentDidMount(){
        // if user have token try to log in
        let response = await LoginUtils.handleUnloggedUser();
        // recieved "exit" its impossible to log in the user with the existing token
        if (response !=="exit"){
            this.props.history.push("/vacationsboard");
            return
        }
    }

    // setState username function
    private setUserName = (args: ChangeEvent<HTMLInputElement>) => {
        const userName = args.target.value;
        this.setState({userName});
    }
    // setState password function
    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        this.setState({password});
    }

    // make sure that the inputs are valid by length so server wont have to deal with useless reuqests
    private validateInputs(){
        if (this.state.userName==="" || this.state.password===""){
            return false;
        }
        if (this.state.userName.length > 12 || this.state.userName.length < 3 ||
            this.state.password.length < 6 || this.state.password.length > 12){
            return false;
        }
    }
    
    private login = async () => {

        if (this.validateInputs()===false){
            toast.warning("Please fill valid username and password!");
            return;
        }

        try {
            let userLoginDetails = new UserLoginDetails(this.state.userName, this.state.password);

            // send the server post with the username and password
            const response =  await axios.post<SuccessfulLoginServerResponse>("https://adar-vacations.herokuapp.com/users/login", userLoginDetails);
            const serverResponse = response.data;
            
            // callback for static function that updates redux in case of successfull login
            LoginUtils.updateReduxStoreOnLogin(this.state.userName, true, serverResponse.userType);

            // callback for static function that saves user details on session storage
            LoginUtils.saveUserDetailsOnSession(serverResponse);

            toast.success("Welcome Back " + this.state.userName + "!")

            // if the user is admin the redirect him to admin page, else, just user page
            if (serverResponse.userType === "ADMIN") {
                this.props.history.push('/admin')
                sessionStorage.setItem("userType", "ADMIN");
            }
            else{
                this.props.history.push('/vacationsboard')
                sessionStorage.setItem("userType", "USER");
            }
            // callback for static function that sets user socket
            LoginUtils.setUserSocket();
        }

        // catch error 
        catch (err) {
            toast.error(err.response.data.error);
            console.log(err.response.data.error);
        }
    }

    render() {
        return (
            <div className="entranceDiv">
                <h2>Login</h2>
                <form id="form1" onSubmit={(event) => event.preventDefault()}>
                <table>
                    <tbody id="loginTable">
                        <tr>
                            <td>
                            Username:
                            </td>
                            <td>
                                <input placeholder="Username" 
                                 value={this.state.userName}
                                 onChange={this.setUserName}
                                 type="text"></input>
                            </td>
                        </tr>
                        
                        <tr>
                            <td>
                            Password:
                            </td>
                            <td>
                                <input placeholder="Password" 
                                autoComplete="on"
                                type="password"
                                onChange={this.setPassword}
                                value={this.state.password}>
                                    
                                </input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </form>


                <Button id="loginButton" type="submit" form="form1" className="button" onClick={this.login}>
                    LOGIN
                </Button>
                <br></br><br></br>



                Don't have an account?<br></br>
                <Button component={NavLink} to="/register" className="button">
                    Register
                </Button>
            </div>
        )
    }
}
