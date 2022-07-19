import React, { Component } from 'react'
import Modal from 'react-bootstrap/esm/Modal';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import BarChart from './BarChart';

interface graphState {
    isGraphVisible: boolean
}

export default class AdminGraph extends Component<any, graphState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            isGraphVisible: store.getState().isAdminGraphVisible,
        };
    }

    // just set state on update
    public componentDidMount () {
        this.setState({isGraphVisible: store.getState().isAdminGraphVisible})
    }
    
    // closes the modal
    private handleClose = () => {
        store.dispatch({ type: ActionType.handleAdminGraphVisibility, payload: false });
        this.props.hideModal();
    }

    render() {
        return (
            <Modal animation={false}
                show={this.state.isGraphVisible}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Vacations Graph</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="bar-chart">
                        <BarChart props={this.props}/>
                    </div>
                </Modal.Body>

                <Modal.Footer className="modal-footer">
                    {/* <Button className="remove-vacation-btn btn btn-info" onClick={this.handleClose}>Close</Button> */}
                </Modal.Footer>
            </Modal>

        )
    }
}

