import { Component } from 'react'
import { toast } from 'react-toastify';

export default class FieldsUtils extends Component {
    
    static validateField = (input:string, min:number, inputValidator: any) => {
        if (FieldsUtils.validateInput(input, min, inputValidator) === "tooShort"){
            return false;
        }
        if (FieldsUtils.validateInput(input, min, inputValidator) === "tooLong"){
            return false;
        }
    }


    // passing all params, except for maxlength which is 12 for all params 
    static validateInput = (input: string, min: number, inputValidator: any) =>{
        if (input.length < min){
            inputValidator.innerHTML = ("This Input Is Too Short &nbsp; &nbsp; Min Length Is " + min + " Characters  &#10060");
            return "tooShort";
        }
        if (input.length > 12){
            inputValidator.innerHTML = ("This Input Is Too Long &nbsp; &nbsp;Max Length Is " + 12 + " Characters  &#10060");
            return "tooLong";
        }
        inputValidator.innerHTML = ("This Input Is Valid  &#9989;")
        return "valid";
    }

    // validate that to date is bigger than from date
    static isToDateBigger = (fromDate:any, toDate:any) =>{
        if (new Date(fromDate) > new Date (toDate)){
            toast.warning("To date cant be later than from date!");
            return false;
        }
        if (new Date(fromDate) < new Date()){
            toast.warning("From date is already passed!\nPlease fill a new one");
            return false;
        }
        return true;
    }



}
