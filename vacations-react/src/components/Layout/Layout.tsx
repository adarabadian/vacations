import React, { Component } from 'react';
import Header from '../Header/Header';
import Login from '../Login/Login';
import AllVacationsBoard from '../AllVacationsBoard/AllVacationsBoard';
import { Switch, Route, BrowserRouter } from "react-router-dom"; 
import Footer from '../Footer/Footer';
import "./Layout.css";
import Register from '../Register/Register';
import Admin from "../Admin/Admin";
import PrivateRoute from '../PrivateRoute/PrivateRoute';


export default class Layout extends Component{
    render() {
        return (
            <div id="layout"> 
                <Header />

                <div id="mainDiv">
                    <BrowserRouter>
                        <Switch>
                            <Route path="/" component={Login} exact / >
                            <Route path="/register" component={Register} exact / >
                            <PrivateRoute path="/vacationsboard" component={AllVacationsBoard} exact />
                            <PrivateRoute path="/admin" component={Admin} exact / >
                        </Switch>
                    </BrowserRouter>
                </div>
                
                <Footer />
            </div>
        )
    }
    
}


