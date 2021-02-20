import { extend } from "jquery";
import { IValidationService } from "./IValidaitonService";

export class ValidationService implements IValidationService {
    public isNumeric(value): boolean {
        let intRegex = /^\d+$/;
        let floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
        return floatRegex.test(value);
    }
    public isEmail(value: string): boolean {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }
}