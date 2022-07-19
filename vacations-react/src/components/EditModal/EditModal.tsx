import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import React, { ChangeEvent, Component } from 'react';
import { Vacation } from '../../models/Vacation';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import './Modal.css';
import {Collapse} from 'react-collapse';
import axios from "axios";
import { toast } from 'react-toastify';
import FieldUtils from '../../utils/FieldsUtils';

interface modalState {
    vacationToEdit: Vacation,
    editedVacation: Vacation,
    isModalVisible: boolean,
    isDatesCollapserOpen: boolean,
    collapserButtonText: string
}

export default class EditModal extends Component<any, modalState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            vacationToEdit:       store.getState().vacationToEdit,
            editedVacation:       new Vacation(),
            isModalVisible:       store.getState().isEditModalVisible,
            isDatesCollapserOpen: false,
            collapserButtonText:  "Change vacations dates"
        };
    }

    // close modal function
    private handleClose = () => {
        store.dispatch({ type: ActionType.handleVacationEditModal, payload: [false, false] });
        this.setState({isDatesCollapserOpen: false})
        this.props.hideModal();
    }

    // just set state on mount
    public componentDidMount() {
        this.setState({ editedVacation: this.state.vacationToEdit });
    }

    // toggle the date collapser status
    private setCollapserState = () =>{
        let newState = {...this.state};
        let isDatesCollapserOpen = !newState.isDatesCollapserOpen;
        let collapserButtonText ;

        // toggle the date collapser button text
        if (isDatesCollapserOpen){
            collapserButtonText = "Keep the original dates";
        }
        else{
            collapserButtonText = "Change vacations dates";
        }

        // update state
        this.setState({isDatesCollapserOpen, collapserButtonText});
    }

    // FUNCTIONS THAT REPLACES THE DATES FORMAT, JUST REPLACING "YYYY" PLACE WITH "DD" AND "-" WITH / 
    // this function just reformatting the dates to match the server dates format expectations
    private convertDateFormat = (date: string):string =>{
        let newDateArray = date.split("/");
        let newDate = newDateArray[2] + "-" + newDateArray[1] + "-" + newDateArray[0];
        return newDate;
    }
    // dates come out in different format, so this function just reformatting the dates to match the other vacations in terms of UI
    private changeDateFormat = (date: string):string =>{
        let newDateArray = date.split("-");
        let newDate = newDateArray[2] + "/" + newDateArray[1] + "/" + newDateArray[0];
        return newDate;
    }

    private saveVacationChanges = async () => {
        let newState = {...this.state};
        let editedVacation = newState.editedVacation;
        let originalVacation = newState.vacationToEdit;

        // Multer if pic changed delete original pic and upload new one
        const data = new FormData();
        data.append('fileToDelete', originalVacation.picture);
        data.append('file', editedVacation.picture);

        // if dates didn't changed then change formats
        if (!this.state.isDatesCollapserOpen){
            editedVacation.fromDate = this.convertDateFormat(originalVacation.fromDate);
            editedVacation.toDate = this.convertDateFormat(originalVacation.toDate);
        }
        // validate that to date is bigger than from date
        if (FieldUtils.isToDateBigger(editedVacation.fromDate, editedVacation.toDate) !== true){
            return
        };
        // validate that to no date is empty
        if (editedVacation.fromDate === "" || editedVacation.toDate === ""){
            toast.warning("Please fill both dates!")
            return;
        }

        // if pic changed then replace it 
        if (editedVacation.picture !== originalVacation.picture) {
            const res = await axios.post("https://adar-vacations.herokuapp.com/vacations/upload", data, {});
            editedVacation.picture = res.data.filename;
        }

        // close date collapser
        this.setState({isDatesCollapserOpen: false}); 

        try {
            // send edited vacation to server
            await axios.post("https://adar-vacations.herokuapp.com/vacations/editVacation/",editedVacation);
            toast.success("Congratulations, The vacation was edited successfuly.");

            // hide Modal
            this.props.hideModal();
            
            // change dates formats to match UI
            editedVacation.fromDate = this.changeDateFormat(editedVacation.fromDate);
            editedVacation.toDate = this.changeDateFormat(editedVacation.toDate);

            this.props.saveEditChanges(editedVacation);
        }
        // catch if failed
        catch (err) {
            toast.error(err.response.data.error);
            console.log(err);
        }
    }


    // SET STATES FROM INPUTS FUNCTIONS
    private setFromDate = (args: ChangeEvent<HTMLInputElement>) => { 
        let editedVacation = {...this.state.editedVacation};
        editedVacation.fromDate = args.target.value;
        this.setState({editedVacation})
    }
    private setToDate = (args: ChangeEvent<HTMLInputElement>) => {
        let editedVacation = {...this.state.editedVacation};
        editedVacation.toDate = args.target.value;
        this.setState({editedVacation})
    }
    private setPicture = (args: ChangeEvent<HTMLInputElement>) => {
        let editedVacation = {...this.state.editedVacation};
        editedVacation.picture = args.target.files[0];
        this.setState({editedVacation})
    }
    private setDestination = (args: ChangeEvent<HTMLInputElement>) => {
        let editedVacation = {...this.state.editedVacation};
        editedVacation.destination = args.target.value;
        this.setState({editedVacation})
    }
    private setDescription = (args: ChangeEvent<HTMLTextAreaElement>) => {    
        let editedVacation = {...this.state.editedVacation};
        editedVacation.description = args.target.value;
        this.setState({editedVacation})
    }
    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        let editedVacation = {...this.state.editedVacation};
        editedVacation.price = +args.target.value;
        this.setState({editedVacation})
    }

    render() {
        return (
            <div className="edit-modal">
                <Modal open={this.state.isModalVisible}
                    onClose={this.handleClose}>
                        
                    <div id="editModal">
                        <h1>Edit Vacation</h1>
                        <p className="cardAddText">Photo address:<input type="file" id="picture" onChange={this.setPicture}
                            // value={this.state.editedVacation.picture} 
                            placeholder="URL"></input></p>

                        <p className="cardAddText">Destination:  <input onChange={this.setDestination}
                            id="destination" type="text" maxLength={30}
                            value={this.state.editedVacation.destination} placeholder="Destination"></input></p>

                        <p>Description: <textarea onChange={this.setDescription}
                            id="description" value={this.state.editedVacation.description}
                            className="description" placeholder="Description"></textarea></p>

                        <div className="smallInputsDiv">
                            <div id="dateSection">
                                <Button id="collapserToggler" onClick={this.setCollapserState}
                                 className="modalButtons">
                                    {this.state.collapserButtonText}
                                </Button>

                                <Collapse isOpened={this.state.isDatesCollapserOpen}>
                                    <p className="cardAddText">From Date: <input onChange={this.setFromDate}
                                        id="fromDate"
                                        className="smallInputs" type="date"></input></p>

                                    <p className="cardAddText">To Date:  <input onChange={this.setToDate}
                                     id="toDate"
                                        className="smallInputs" type="date"></input></p>
                                </Collapse>
                                
                            </div>

                            <p className="cardAddText"><span id="priceOnModal">Price:</span><input onChange={this.setPrice}
                                id="price"
                                value={this.state.editedVacation.price}
                                placeholder="Price" className="smallInputs" type="number"></input></p>

                            <div id="buttonsDiv">
                                <Button className="modalButtons"
                                onClick={this.saveVacationChanges}
                                >Save Vacation</Button>

                                <Button  className="modalButtons"
                                onClick={this.handleClose}
                                >Cancel</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
