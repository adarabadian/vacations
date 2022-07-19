import React, { Component } from 'react';
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import "./Header.css";
import axios from "axios";
import { toast } from 'react-toastify';
import  LoginUtils  from '../../utils/LoginUtils';


interface headerState {
    isUserLoggedIn: boolean,
    userName: string,
    helloMessage: string
}

export default class Header extends Component<any, headerState> {
    
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isUserLoggedIn: store.getState().isUserLoggedIn,
            userName: store.getState().userName,
            helloMessage: "Hello guest"
        };
    }

    // Get states from redux for header
    componentDidMount(){
        this.unsubscribeStore = store.subscribe(() => this.setState({
            isUserLoggedIn: store.getState().isUserLoggedIn,
            userName: store.getState().userName
         }));
    }

    // stop subscribing after leaving the component
    componentWillUnmount(){
        this.unsubscribeStore();
    }

    // get Hello Message Content according to log in status
    private getHelloMessageContent = () =>{
        let newState = {...this.state};
        let helloMessage = newState.helloMessage;

        if (this.state.isUserLoggedIn){
            helloMessage = ("Hello " + this.state.userName);
        }
        else{
            helloMessage = ("Hello guest");
        }

        return (helloMessage);
    } 

    // log user out
    private logOutUser = async () =>{
        try{
            let token =  sessionStorage.getItem("token");
            axios.defaults.headers.common['authorization'] = "Bearer " + token;
            await axios.post("https://adar-vacations.herokuapp.com/users/logOutUser/");

            // clear session storage so he wont have useless data and wont be able to login until he relogs
            sessionStorage.clear();
            LoginUtils.logOutUser();
        }
        // catch in case of failure
        catch (err){     
        toast.error(err.response.data.error);
        }
    }

    // dynamic log in button, if user isn't logged in he will just get "please login"
    private getLogOutButton = () =>{
        if (this.state.isUserLoggedIn){
            return(<button onClick={this.logOutUser}>Logout
                    </button>)
        }
        return(<button disabled>Please login</button>);
    }

    render() {
        return (
            <div className="header">
                    <button id="helloMessage" disabled>{this.getHelloMessageContent()}
                    </button>
                <h1>
                    Adar's Vacations Site
                </h1>
                {this.getLogOutButton()}
                    
            </div>
        )
    }
}
