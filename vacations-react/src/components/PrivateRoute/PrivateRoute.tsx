import  React from  "react";
import { Route, Redirect } from  "react-router-dom";
import { store } from "../../redux/store";

const  PrivateRoute: React.FC<{
        component: any;
        path: string;
        exact: boolean;
    }> = (props) => {

    const condition = isLoggedIn();

    return  condition ? (<Route  path={props.path}  exact={props.exact} component={props.component} />) : 
        (<Redirect  to="/"  />);
};

const isLoggedIn = () =>{
    return store.getState().isUserLoggedIn;
}

export  default  PrivateRoute;