import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { getAllVacationsFromServer } from '../../models/getAllVacationsFromServer';
import { Vacation } from '../../models/Vacation';
import '../AllVacationsBoard/VacationsBoard.css';
import'./Admin.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import EditModal from '../EditModal/EditModal'
import { Unsubscribe } from 'redux';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import LoginUtils from '../../utils/LoginUtils';
import NewVacationModal from '../NewVacationModal/NewVacationModal';
import graphPicture from './diagram.png';
import newIcon from './new.png';
import AdminGraph from '../AdminGraph/AdminGraph';

interface vacationsState{
    vacations:                 Vacation[],
    newVacation:               Vacation,
    isEditModalVisible:        boolean,
    isUserLoggedIn:            boolean,
    userType:                  string,
    isNewVacationModalVisible: boolean,
    socket:                    any,
    isAdminGraphVisible:       boolean
}

export default class Admin extends Component <any, vacationsState>{
    private unsubscribeStore: Unsubscribe;

    public constructor(props: any){
        super(props);
        this.state = {
            vacations :                new Array<Vacation>(),
            newVacation:               store.getState().vacationToAdd,
            isEditModalVisible:        store.getState().isEditModalVisible,
            isUserLoggedIn:            store.getState().isUserLoggedIn,
            userType:                  store.getState().userType,
            isNewVacationModalVisible: store.getState().isNewVacationModalVisible,
            socket:                    store.getState().socket,
            isAdminGraphVisible:       store.getState().isAdminGraphVisible
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
                    isUserLoggedIn:            store.getState().isUserLoggedIn,
                    userType:                  store.getState().userType,
                    newVacation:               store.getState().vacationToAdd,
                    isEditModalVisible:        store.getState().isEditModalVisible,
                    isNewVacationModalVisible: store.getState().isNewVacationModalVisible,
                    isAdminGraphVisible:       store.getState().isAdminGraphVisible,
                    
                }, () => {
                    // listen to the changes in the state - handles the case that the user logged out. 
                    this.changeHistory();
                })
        );
        // callback for set socket listeners function
        this.setSocketListeners();
    }

    // stop subscribing after leaving the component
    componentWillUnmount() {
        this.unsubscribeStore();
    }

    // in any change of user type or login status redirect
    componentDidUpdate = () =>{
        if (!store.getState().isUserLoggedIn){
            this.props.history.push("/");
        }
        if (store.getState().userType !== "ADMIN"){
            this.props.history.push("/vacationsBoard");
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

        // get added vacation from socket
        this.state.socket.on("add-vacation", (newVacation: Vacation) => {
            newVacation.fromDate = this.changeDateFormat(newVacation.fromDate);
            newVacation.toDate = this.changeDateFormat(newVacation.toDate);

            // push new vacation to vacations array
            let allVacations = this.state.vacations;
            allVacations.push(newVacation);
            this.setState({vacations: allVacations});
        });
    }

    private changeHistory = async () =>{
        if (!this.state.isUserLoggedIn){
            this.props.history.push("/");
        }
    } 

    // returns index of vacation that needs update 
    private getIndexFromVacations = (vacationID: number) =>{
        let allVacations = this.state.vacations
        let selectedIndex = allVacations.findIndex(
            x => x.id === vacationID
        );
        return selectedIndex;
    }

    // opens various modals for admin
    private openEditVacationModal(vacation: Vacation){
        store.dispatch({ type: ActionType.handleVacationEditModal, payload: [vacation, true] });
        this.setState({isEditModalVisible: true});
    }
    private openNewVacationModal(){
        store.dispatch({ type: ActionType.handleNewVacationModal, payload: [new Vacation(0, "", "" , new File([""], ""), "" ,"" ,0 ,false ,0),true] });
        this.setState({isNewVacationModalVisible: true});
    }
    private openAdminGraphModal(){
        store.dispatch({ type: ActionType.handleAdminGraphVisibility, payload: true });
        this.setState({isAdminGraphVisible: true});
    }
    // hides the modals
    private hideEditModal = () =>{
        store.dispatch({ type: ActionType.handleVacationEditModal, payload: [false, false] });
        this.setState({isEditModalVisible: false});
    }
    private hideNewVacationModal = () =>{
        this.setState({isNewVacationModalVisible: false});
    }
    private hideAdminGraphModal = () =>{
        this.setState({isAdminGraphVisible: false});
    }

    // function that happens after vacation was edited 
    private saveEditChanges = (updatedVacation:Vacation) =>{
        let allVacations = this.state.vacations;

        // replace the old vacation with the edited one
        allVacations = allVacations.map(vacation => {
            if (vacation.id === updatedVacation.id){
                return updatedVacation;
            }
            return vacation;
        });
        
        this.setState({vacations: allVacations});
        // emit to all users the updated vacation
        this.state.socket.emit("update-vacation", updatedVacation);
    }

    // prompts delete dialog (just confirmation)
    private promptDeleteDialog = (vacation: Vacation) =>{
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete the vacation to ' + vacation.destination,
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.deleteVacation(vacation)
              },
              {
                label: 'No',
                onClick: () => {return}
              }
            ]
          });

    }

    // dates come out in wrong format, so this function just reformatting the dates to match the other vacations
    private changeDateFormat = (date: string):string =>{
        let newDateArray = date.split("-");
        let newDate = newDateArray[2] + "/" + newDateArray[1] + "/" + newDateArray[0];
        
        return newDate;
    }
    
    private deleteVacation = async (vacation: Vacation) =>{
        try {
            // send the server post with the vacation id to delete from DB
            await axios.post("https://adar-vacations.herokuapp.com/vacations/deleteVacation/"+vacation.id);
            
            let vacations = this.state.vacations;
            let index = vacations.indexOf(vacation);

            // remove the vacation from vacations array
            vacations.splice(index, 1);
            this.setState({vacations});
            
            // send everybody the deleted vacation id so they will delete it too
            this.state.socket.emit("delete-vacation", vacation.id);

            toast.success("The vacation was deleted successfuly.");
        }
        // catch on failure
        catch (err) {
            toast.error(err.response.data.error);
            console.log(err);
        }
    }

    render() {
        return (
            <div id="allVacationsBoard" className="scrollbar scrollbar-morpheus-den">
            <h1 className="headers">Manage Vacations</h1>
                <div>
                {this.state.vacations.map( (vacation, index) => 
                        <div key={index} className="card">
                            <img className="card-img-top" src={vacation.picture.toString()} alt="../../UndefinedPictures/defaultPicture.jpg"></img>
                            <div className="card-body">
                                <h5 className="card-title">{vacation.destination}</h5>
                                <p className="desc">{vacation.description}</p>
                                <p className="card-text"><b>From Date: </b>{vacation.fromDate}</p>
                                <p className="card-text"><b>To Date: </b>{vacation.toDate}</p>
                                <h5 className="card-title">{vacation.price}$</h5>
                                <div className="cardIcons">
                                    <span className="material-icons" onClick={()=>{this.promptDeleteDialog(vacation)}}>delete_forever</span>
                                    <span className="material-icons" onClick={()=>{this.openEditVacationModal(vacation)}}>build</span>
                                    <span className="followersAmount" id={JSON.stringify(vacation.id)}>
                                    &hearts; {vacation.followersAmount}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div id="adminButtonsDiv">
                    <Button onClick={()=>{this.openAdminGraphModal()}}>Show Graph <img src={graphPicture} alt="" /></Button>
                    <Button onClick={()=>{this.openNewVacationModal()}}>New Vacation<img src={newIcon} alt="" /></Button>
                </div>

                {this.state.isEditModalVisible === true && <EditModal hideModal={this.hideEditModal} saveEditChanges={this.saveEditChanges}/>}
                {this.state.isNewVacationModalVisible === true && <NewVacationModal hideModal={this.hideNewVacationModal}/>}
                {this.state.isAdminGraphVisible === true && <AdminGraph props={this.state.vacations} hideModal={this.hideAdminGraphModal}/>}
            </div>
        );
    }
}
