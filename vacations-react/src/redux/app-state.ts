import { Vacation } from "../models/Vacation";

export class AppState {
    public vacationToAdd: Vacation = new Vacation(0, "", "" , new File([""], ""), "" ,"" ,0 ,false ,0);
    public isNewVacationModalVisible: boolean = false;

    public vacationToEdit: Vacation;
    public isEditModalVisible: boolean = false;

    public isAdminGraphVisible: boolean = false;

    public isUserLoggedIn: boolean;
    public userName: string = "";
    public socket: any = "";
    public userType: string = "";
}