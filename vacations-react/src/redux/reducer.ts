import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

// This function is NOT called direcrtly by you
export function reduce(oldAppState: AppState, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {

        case ActionType.handleVacationEditModal:
            newAppState.vacationToEdit = action.payload[0];
            newAppState.isEditModalVisible = action.payload[1];
            break;
        
        case ActionType.handleNewVacationModal:
            newAppState.vacationToAdd = action.payload[0];
            newAppState.isNewVacationModalVisible = action.payload[1];
            break;

        case ActionType.handleAdminGraphVisibility:
            newAppState.isAdminGraphVisible = action.payload;
            break;

        case ActionType.updateUserLoginStatus:
            newAppState.userName = action.payload[0];
            newAppState.isUserLoggedIn = action.payload[1];
            newAppState.userType = action.payload[2];
            break;

        case ActionType.logOutUser:
            newAppState.isUserLoggedIn = action.payload;
            newAppState.socket = "";
            break;

        case ActionType.setUserSocket:
            newAppState.socket = action.payload;
            break;


        // case ActionType.PushToUnLikedVacations:
        //     newAppState.unLikedVacations.push(action.payload);
        //     break;

        // case ActionType.GetAllCoupons:
        //     newAppState.coupons = action.payload;
        //     break;
    }

    // After returning the new state, it's being published to all subscribers
    // Each component will render itself based on the new state
    return newAppState;
}