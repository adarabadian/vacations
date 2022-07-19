import React, { ChangeEvent, Component } from 'react';
import {NavLink} from 'react-router-dom';
import "./Register.css";
import Button from '@material-ui/core/Button';
import axios from "axios";
import { UserRegistrationDetails } from '../../models/UserRegisterDetails';
import { SuccessfulLoginServerResponse } from '../../models/SuccessfulLoginServerResponse';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import FieldsUtils from '../../utils/FieldsUtils';
import LoginUtils from '../../utils/LoginUtils';

interface RegistrationState {
    firstName:        string,
    lastName:         string,
    userName:         string,
    password:         string,

    isFirstNameValid:   boolean,
    isLastNameValid:    boolean,
    isUserNameValid:    boolean,
    isPasswordValid:    boolean
}

export default class Register extends Component <any, RegistrationState> {
    firstNameValidator: React.RefObject<HTMLTableRowElement>;
    lastNameValidator:  React.RefObject<HTMLTableRowElement> ;
    userNameValidator:  React.RefObject<HTMLTableRowElement> ;
    passwordValidator:  React.RefObject<HTMLTableRowElement> ;


    public constructor(props: any) {
        super(props);
        this.state = {
            firstName: "",
            lastName:  "",
            userName:  "",
            password:  "",

            isFirstNameValid: false,
            isLastNameValid: false,
            isUserNameValid: false,
            isPasswordValid: false
        };

        this.firstNameValidator = React.createRef()
        this.lastNameValidator = React.createRef()
        this.userNameValidator = React.createRef()
        this.passwordValidator = React.createRef()
    }

    // SET STATES FROM INPUTS FUNCTIONS and validate them after change
    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        this.setState({firstName});

        this.isFirstNameValid(args.target);
    }
    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        this.setState({lastName});
        
        this.isLastNameValid(args.target);
    }
    private setUserName = (args: ChangeEvent<HTMLInputElement>) => {
        const userName = args.target.value;
        this.setState({userName});
        
        this.isUserNameValid(args.target);
    }
    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        this.setState({password});

        this.isPasswordValid(args.target);
    }

    // this function is called only when registering, makes sure that user cant send any invalid data
    private areInputsValid(){
        if (this.state.isFirstNameValid === false || 
            this.state.isLastNameValid  === false ||  
            this.state.isPasswordValid  === false || 
            this.state.isUserNameValid  === false ){
            return false;
        }
    }

    // check if firstname valid
    private isFirstNameValid = (element: HTMLInputElement) => {
        const inputValidator = this.firstNameValidator.current;
        const min = 2;

        // callback for static function that recieves value, min length, and the hook of the validator of the parameter
        if (FieldsUtils.validateField(element.value, min, inputValidator) === false){
            element.className="invalidInput";
            this.setState({isFirstNameValid: false});
            return false;
        };
        
        this.setState({isFirstNameValid: true});
        element.className="validInput"; 
    }

    // check if lastname valid
    private isLastNameValid = (element: HTMLInputElement) => {
        const inputValidator = this.lastNameValidator.current;
        const min = 2;

        // callback for static function that recieves value, min length, and the hook of the validator of the parameter
        if (FieldsUtils.validateField(element.value, min, inputValidator) === false){
            element.className="invalidInput";
            this.setState({isLastNameValid: false});
            return false;
        };
        
        this.setState({isLastNameValid: true});
        element.className="validInput"; 
    }

    // check if UserName valid
    private isUserNameValid = (element: HTMLInputElement) => {
        const inputValidator = this.userNameValidator.current;
        const min = 3;

        // callback for static function that recieves value, min length, and the hook of the validator of the parameter
        if (FieldsUtils.validateField(element.value, min, inputValidator) === false){
            element.className="invalidInput";
            this.setState({isUserNameValid: false});
            return false;
        };
        
        this.setState({isUserNameValid: true});
        element.className="validInput"; 
    }
    
    // check if password valid
    private isPasswordValid = (element: HTMLInputElement) => {
        const inputValidator = this.passwordValidator.current;
        const min = 6;

        // callback for static function that recieves value, min length, and the hook of the validator of the parameter
        if (FieldsUtils.validateField(element.value, min, inputValidator) === false){
            element.className="invalidInput";
            this.setState({isPasswordValid: false});
            return false;
        };
        
        this.setState({isPasswordValid: true});
        element.className="validInput"; 
    }

    // function that being called after leaving the username input.
    // checks if lengths are valid try to find out if username is already taken
    private isUserNameExists = async (event: any) => {
        let element = event.target;

        try {
            // check if length valid, if invalid just exit
            let userName = {userName: this.state.userName};
            if (userName.userName.length > 12 || userName.userName.length < 3){
                return;
            }

            // send server username to figure out if username taken
            const response =  await axios.post("https://adar-vacations.herokuapp.com/users/isUserNameExists", userName);
            const serverResponse = response.data;

            // set input element with "valid" class
            element.className="validInput";

            // set the input's validator with appropriate text
            this.userNameValidator.current.innerHTML = "This username is free to use!  &#9989;";

            // set state with valid user = true
            this.setState({isUserNameValid: true});
            toast.success(serverResponse);
        }

        catch (err) {
            if(err.response === undefined){
                toast(err);
            }
            // if username unavailable then give its input "invalid" class
            element.className="invalidInput";

            // set the input's validator with appropriate text
            this.userNameValidator.current.innerHTML = err.response.data.error;

            // set state with valid user = false
            this.setState({isUserNameValid: false});

            toast.error(err.response.data.error);
            console.log(err);
        }
    }

    // register function
    public registerNewUser = async () => {
        // if inputs are invalid just return
        if (this.areInputsValid() === false){
            toast.warn("OOPS 😨, looks like you didn't filled the details correctly.")
            return;
        }

        try {
            // create userRegistrationDetails variable that contains the user details
            let userRegistrationDetails = new UserRegistrationDetails(this.state.firstName, this.state.lastName, this.state.userName, this.state.password);

            // send server the details
            const response =  await axios.post<SuccessfulLoginServerResponse>("https://adar-vacations.herokuapp.com/users/register", userRegistrationDetails);
            const serverResponse = response.data;

            // save the user details in session storage
            await LoginUtils.saveUserDetailsOnSession(serverResponse);

            // redirect him to user page
            this.props.history.push('/vacationsboard');
            
            toast.success("Congratulations, Registered successfuly.");
        }
        // catch if failed
        catch (err) {
            toast.error(err.response.data.error);
            console.log(err);
        }
    }

    
    render() {
        return (
            <div className="entranceDiv">
                <h2>Register</h2>
                    <form id="form1" onSubmit={(event) => event.preventDefault()}>
                        <table>
                        <tbody>
                            <tr>
                                <td className="normalTableDivs">First Name: </td>
                                <td className="normalTableDivs">
                                    <input placeholder="First Name" type="text" id="firstName"
                                    value={this.state.firstName} onChange={this.setFirstName}
                                    ></input>
                                </td>
                            </tr>
                            <tr className="validator" id="firstNameValidator" ref={this.firstNameValidator}>
                            </tr>
                            <tr>
                                <td className="normalTableDivs">Last Name: </td>
                                <td className="normalTableDivs">
                                    <input placeholder="Last Name" type="text" id="lastName"
                                    value={this.state.lastName} onChange={this.setLastName}
                                    ></input>
                                </td>
                            </tr>
                            
                            <tr className="validator" id="lastNameValidator" ref={this.lastNameValidator}></tr>
                            
                            <tr>
                                <td className="normalTableDivs">Username: </td>
                                <td className="normalTableDivs">
                                    <input placeholder="Username" type="text" id="userName"
                                    value={this.state.userName} onBlur={(event) =>{this.isUserNameExists(event)}} 
                                    onChange={this.setUserName}
                                    ></input>
                                </td>
                            </tr>
                            
                            <tr className="validator" id="userNameValidator" ref={this.userNameValidator}></tr>

                            <tr>
                                <td className="normalTableDivs">Password: </td>
                                <td className="normalTableDivs">
                                    <input 
                                    placeholder="Password" 
                                    type="password" 
                                    id="password"
                                    autoComplete="on"
                                    value={this.state.password} 
                                    onChange={this.setPassword}>
                                </input>
                                </td>
                            </tr>
                            
                            <tr className="validator" id="passwordValidator" ref={this.passwordValidator}></tr>
                        </tbody>
                    </table>
                </form>


                    <Button  onClick={this.registerNewUser} type="submit" form="form1" className="button">
                    Create Account!
                    </Button>
                    
                    <br></br><br></br>
                    
                    Forgot that you have an account?<br></br>

                    <Button component={NavLink} to="/" className="button">
                    Back To Login
                    </Button>

            </div>
        )
    }
}
