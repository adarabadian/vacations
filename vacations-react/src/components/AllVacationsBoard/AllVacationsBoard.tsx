import React, { Component } from 'react';
import 'material-design-icons/iconfont/material-icons.css';
import { Vacation } from '../../models/Vacation';
import { getAllVacationsFromServer } from '../../models/getAllVacationsFromServer';
import axios from "axios";
import "./VacationsBoard.css";
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import LoginUtils from '../../utils/LoginUtils';


interface vacationsState{
    vacations: Vacation[]
    isUserLoggedIn: boolean
    socket: any
}

export default class VacationsBoard extends Component <any, vacationsState>{
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any){
        super(props);
        this.state = {
            vacations : new Array<Vacation>(),
            isUserLoggedIn: store.getState().isUserLoggedIn,
            socket: store.getState().socket,
        };
    }


    async componentDidMount(){
        // redirect user if he is not logged in
        if (store.getState().isUserLoggedIn !== true){
            // try to log in if he have token
            let response = await LoginUtils.handleUnloggedUser();
            // if couldnt login with token just redirect to login
            if (response ==="exit"){
                this.props.history.push("/");
                return
            }
        }    

        // request all vacations from server
        const allVacations = await getAllVacationsFromServer();
        this.setState({ vacations: allVacations });
        
        // set socket 
        this.setState({ socket : store.getState().socket });

        // listen to redux changes
        this.unsubscribeStore = store.subscribe(
            () => this.setState(
                {
                    isUserLoggedIn: store.getState().isUserLoggedIn,
                    socket: store.getState().socket
                }, () => {
                    // listen to the changes in the state - handles the case that the user logged out. 
                    this.changeHistory();
                })
        );
        // callback for set socket listeners function
        this.setSocketListeners();
    }
    componentWillUnmount (){
        // stop subscribing after leaving the component
        this.unsubscribeStore()
    }

    // in any change of user type or login status redirect
    componentDidUpdate = () =>{
        if (!store.getState().isUserLoggedIn){
            this.props.history.push("/");
        }
        if (store.getState().userType === "ADMIN"){
            this.props.history.push("/admin");
        }
    }

    private changeHistory = async () =>{
        if (!this.state.isUserLoggedIn){
            // this.socket.disconnect
            this.props.history.push("/");
        }
    }

    private setSocketListeners = () =>{
        // listener for vacation likes from socket
        this.state.socket.on("increase-vacation-likes", (vacationID: number) => {
            let selectedIndex = this.getIndexFromVacations(vacationID);
            let allVacations = this.state.vacations;

            // increase vacation followers by 1
            allVacations[selectedIndex].followersAmount = allVacations[selectedIndex].followersAmount+1;
            this.setState({vacations: allVacations});
        });  
        
        // listener for vacation dislikes from socket
        this.state.socket.on("decrease-vacation-likes", (vacationID: number) => {
            let selectedIndex = this.getIndexFromVacations(vacationID);
            let allVacations = this.state.vacations;
            
            // decrease vacation followers by 1
            allVacations[selectedIndex].followersAmount = allVacations[selectedIndex].followersAmount-1;
            this.setState({vacations: allVacations});
        });

        // listener for delete vacation from socket
        this.state.socket.on("delete-vacation", (vacationID: number) => {
            let selectedIndex = this.getIndexFromVacations(vacationID);
            let allVacations = this.state.vacations;
            
            // remove the deleted vacation from vacations array
            allVacations.splice(selectedIndex, 1);
            this.setState({vacations: allVacations});
        });  

        // listener for vacation updates from socket
        this.state.socket.on("update-vacation", (updatedVacation: Vacation) => {
            let allVacations = this.state.vacations;
            // run through all vacations
            
            allVacations = allVacations.map(vacation => {
                // if its the correct vacation, replace it with the updated one
                if (vacation.id === updatedVacation.id){
                    let index = this.getIndexFromVacations(vacation.id);
                    allVacations[index] = updatedVacation;
                    this.setState({vacations: allVacations});
                    return updatedVacation;
                }
                return vacation;
            })
        }); 

        // get added vacation from socket
        this.state.socket.on("add-vacation", (addedVacation: Vacation) => {
            addedVacation.fromDate = this.changeDateFormat(addedVacation.fromDate);
            addedVacation.toDate = this.changeDateFormat(addedVacation.toDate);

            // push new vacation to vacations array
            let allVacations = this.state.vacations;
            allVacations.push(addedVacation);
            
            this.setState({vacations: allVacations});
        });
    }

    // dates come out in wrong format, so this function just reformatting the dates to match the other vacations
    private changeDateFormat = (date: string):string =>{
        let newDateArray = date.split("-");
        let newDate = newDateArray[2] + "/" + newDateArray[1] + "/" + newDateArray[0];
        
        return newDate;
    }

    // returns index of vacation that needs update
    private getIndexFromVacations = (vacationID: number) =>{
        let allVacations = this.state.vacations;
        let selectedIndex = allVacations.findIndex(
            x => x.id === vacationID
        );
        return selectedIndex;
    }

    // on like click function
    private toggleFavorite = async (vacation:Vacation) =>{
        // toggle favorite status
        let newLikeState = !vacation.isLiked;
        const socket = this.state.socket;

        // if now its liked then send like to server, else send dislike
        if (newLikeState){
            await axios.post("https://adar-vacations.herokuapp.com/vacations/addToFavorites/",{vacationId: vacation.id});
            vacation.followersAmount= vacation.followersAmount+1;
            socket.emit("increase-vacation-likes", vacation.id);
        }
        else{
            await axios.post("https://adar-vacations.herokuapp.com/vacations/removeFromFavorites/",{vacationId: vacation.id});
            vacation.followersAmount = vacation.followersAmount-1;
            socket.emit("decrease-vacation-likes", vacation.id);
        }

        // update the vacation in the array
        vacation.isLiked = newLikeState;
        let newState = {...this.state};
        this.setState(newState);
    }

    // get favorite css class icon
    public static getVacationFavoriteClass = (isLiked: boolean) =>{
        if (isLiked){
            return "material-icons liked"
        }
        return "material-icons"
    }

    // function that sorts the vacations by likes amount
    private order = (a: Vacation, b: Vacation) => {
        if (a.isLiked > b.isLiked) {
            return -1;
        } else if (a.isLiked < b.isLiked) {
            return 1;
        } else {
            return 0;
        }
    }

    render() {
        return (
            <div id="allVacationsBoard" className="scrollbar scrollbar-morpheus-den">
            <h1 className="headers">All Vacations</h1>
                <div id="vacationsBoard">
                    {this.state.vacations.sort((a, b) => this.order(a, b)).map( (vacation, index) =>

                        <div key={index} className="card">
                            <img className="card-img-top" src={vacation.picture.toString()}
                            alt="../../UndefinedPictures/defaultPicture.jpg"></img>
                            <div className="card-body">
                                <h5 className="card-title">{vacation.destination}</h5>
                                <p className="desc">{vacation.description}</p>
                                <p className="card-text"><b>From Date: </b>{vacation.fromDate}</p>
                                <p className="card-text"><b>To Date: </b>{vacation.toDate}</p>
                                <h5 className="card-title">{vacation.price}$</h5>

                                <div className="favoritesContainer">
                                    <span className={VacationsBoard.getVacationFavoriteClass(vacation.isLiked)}
                                    onClick={()=>{
                                        this.toggleFavorite(vacation)
                                        }}>favorite</span>
                                    <span className="followersAmount" id={JSON.stringify(vacation.id)}>{vacation.followersAmount} Liked it</span>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
