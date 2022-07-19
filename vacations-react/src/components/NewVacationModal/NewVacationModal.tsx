import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import React, { ChangeEvent, Component } from 'react';
import { Vacation } from '../../models/Vacation';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import axios from "axios";
import { toast } from 'react-toastify';
import './NewVacationModal.css';
import FieldUtils from '../../utils/FieldsUtils';

interface modalState {
    vacationToAdd:  Vacation,
    isModalVisible: boolean,
    socket:         any
}

export default class NewVacationModal extends Component<any, modalState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            vacationToAdd:  store.getState().vacationToAdd,
            isModalVisible: store.getState().isNewVacationModalVisible,
            socket:         store.getState().socket
        };
    }

    // close modal function
    private handleClose = () => {
        store.dispatch({ type: ActionType.handleNewVacationModal, payload: false });
        this.props.hideModal();
    }

    // SET STATES FROM INPUTS FUNCTIONS
    private setFromDate = (args: ChangeEvent<HTMLInputElement>) => { 
        let vacationToAdd = {...this.state.vacationToAdd};
        vacationToAdd.fromDate = args.target.value;
        this.setState({vacationToAdd})
    }
    private setToDate = (args: ChangeEvent<HTMLInputElement>) => {
        let vacationToAdd = {...this.state.vacationToAdd};
        vacationToAdd.toDate = args.target.value;
        this.setState({vacationToAdd})
    }
    private updateNewVacationPicture = (args: ChangeEvent<HTMLInputElement>) => {
        let vacationToAdd = {...this.state.vacationToAdd};
        vacationToAdd.picture = args.target.files[0];
        this.setState({vacationToAdd})
    }
    private setDestination = (args: ChangeEvent<HTMLInputElement>) => {
        let vacationToAdd = {...this.state.vacationToAdd};
        vacationToAdd.destination = args.target.value;
        this.setState({vacationToAdd})
    }
    private setDescription = (args: ChangeEvent<HTMLTextAreaElement>) => {    
        let vacationToAdd = {...this.state.vacationToAdd};
        vacationToAdd.description = args.target.value;
        this.setState({vacationToAdd})
    }
    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        let vacationToAdd = {...this.state.vacationToAdd};
        vacationToAdd.price = +args.target.value;
        this.setState({vacationToAdd})
    }

    // validate that no parameter is empty
    private isNewVacationValid(){
        if (this.state.vacationToAdd.picture.name === ""){
            return "Picture";
        }
        if (this.state.vacationToAdd.destination.length < 1){
            return "Destination";
        }
        if (this.state.vacationToAdd.description.length < 1){
            return "Description";
        }
        if (this.state.vacationToAdd.fromDate === ""){
            return "From Date";
        }
        if (this.state.vacationToAdd.toDate === ""){
            return "To Date";
        }
        if (this.state.vacationToAdd.price < 1){
            return "Price";
        }
        
        return "valid";
    }

    // add new vacation function
    private addNewVacation = async() => {
        // callback for validation function
        let validation = this.isNewVacationValid();
        if (validation !== "valid"){
            // warn dynamicly about Inputs if isnt valid
            toast.warning("Please Fill A Valid " + validation + " Before Uploading!");
            return false;
        }
                
        // validate that to date is bigger than from date
        if (FieldUtils.isToDateBigger(this.state.vacationToAdd.fromDate, 
            this.state.vacationToAdd.toDate) !== true){
                return;
            }

        // attach pic to send to the server
        // // // // // // // // // // // // // // // // // // // // // // // // // SHOULD BE LET
        const data = new FormData()
        data.append('file', this.state.vacationToAdd.picture);


        try {
            // send pic to the server
            const multerResponse = await axios.post("https://adar-vacations.herokuapp.com/vacations/upload", data, {})
            this.state.vacationToAdd.picture = multerResponse.data.filename;

            // send new vacation to server
            let response = await axios.post("https://adar-vacations.herokuapp.com/vacations/addNewVacation/",this.state.vacationToAdd);
            
            // recieve just the id of new vacation
            this.state.vacationToAdd.id = response.data;

            // close modal
            store.dispatch({ type: ActionType.handleNewVacationModal, payload: [this.state.vacationToAdd, false] });
            this.props.hideModal();

            // send by socket to everyone the new vacation
            this.state.socket.emit("add-vacation", this.state.vacationToAdd);
            
            toast.success("Congratulations, The vacation was added successfuly.");
        }
        // catch if failed
        catch (err) {
            toast.error(err.response.data.error);
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <Modal open={this.state.isModalVisible}
                    onClose={this.handleClose}>
                        
                    <div id="editModal">
                    <div className="card" id="addCard">
                        <h2 className="headers">Add New Vacation</h2>
                            <div className="card-body">
                                <p className="cardAddText">Photo address:
                                <input type="file" onChange={this.updateNewVacationPicture}
                                placeholder="URL"></input></p>

                                <p className="cardAddText">Destination:
                                <input onChange={this.setDestination} type="text" maxLength={30}
                                value={this.state.vacationToAdd.destination} placeholder="Destination"></input></p>

                                <p>Description: <textarea onChange={this.setDescription} value={this.state.vacationToAdd.description} 
                                className="description" placeholder="Description"></textarea></p>

                                <div className="smallInputsDiv">
                                    <p className="cardAddText">From Date: <input onChange={this.setFromDate}
                                        value={this.state.vacationToAdd.fromDate} 
                                        className="smallInputs" type="date"></input></p>

                                    <p className="cardAddText">To Date:  <input onChange={this.setToDate}
                                    value={this.state.vacationToAdd.toDate} 
                                        className="smallInputs" type="date"></input></p>
                                        
                                    <p className="cardAddText">Price:    <input onChange={this.setPrice}
                                        value={this.state.vacationToAdd.price} 
                                        placeholder="Price" className="smallInputs" type="number"></input></p>
                                </div>
                            <Button onClick={this.addNewVacation}>Add Vacation!</Button>
                            <Button onClick={this.handleClose}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
