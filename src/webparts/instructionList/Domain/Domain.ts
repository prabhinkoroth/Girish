import * as moment from "moment";
import { IInstructionListItem } from "../../../models/InstructionList/IInstructionListItem";
import { IListOperationService } from "../../../services/ListOperationSerivices/IListOperationsService";
import { ListOperationService } from "../../../services/ListOperationSerivices/ListOperationService";

import { ListNames } from "./Configuration";
export class InstructionListManager {
    private _listService: IListOperationService = null;

    constructor() {
        this._listService = new ListOperationService();
    }
    public async getInstructionListData(): Promise<IInstructionListItem[]> {
        let clientInstructionMasterSelectFields = ["Id", "Client/Id", "Client/Client_x0020_Name", "Month", "Year", "Status"];
        let clientInstructionMasterExpandFields = ["Client"];
        let clientInstructionsSelectField = ["InstructionMaster/Id", "Country/Title"];
        let clientInstructionsExpandField = ["InstructionMaster", "Country"];
        let momentTodayDate = moment(new Date()).add(1,'days');
        let momentDateAfter90Days = moment(new Date()).subtract(90, 'days');

        let todayString: string = momentTodayDate.format("YYYY-MM-DD");
        let afterSpecificTimeString: string = momentDateAfter90Days.format("YYYY-MM-DD");

        var currentDate = todayString + 'T00:00:00.0000000Z';
        var afterTimeFrameDate = afterSpecificTimeString + 'T00:00:00.0000000Z';
        let filterQuery=`(SubmissionDate gt datetime'${afterTimeFrameDate}') and (SubmissionDate le datetime'${currentDate}')`;

        let clientInstructionMasterItems: any[] = await this._listService.GetAllItemsFromList(ListNames.ClientInstructionMaster, filterQuery, clientInstructionMasterSelectFields, clientInstructionMasterExpandFields);
        let clientInstructions: any[] = await this._listService.GetAllItemsFromList(ListNames.ClientInstructions, "", clientInstructionsSelectField, clientInstructionsExpandField);
        let instructionListItems: IInstructionListItem[] = this.ConvertToModel(clientInstructionMasterItems, clientInstructions);
        return instructionListItems;
    }

    private ConvertToModel(clientInstructionMasterItems: any[], clientInstructions: any[]) {
        let instructionListItems: IInstructionListItem[] = [];
        let instructionMasterItemId: number = 0;
        let instructinLookupId: number = 0;
        for (let masterCounter: number = 0; masterCounter < clientInstructionMasterItems.length; masterCounter++) {
            let masterItem = clientInstructionMasterItems[masterCounter];
            instructionMasterItemId = masterItem["Id"];
            debugger;
            let item: IInstructionListItem = {
                Id:instructionMasterItemId,
                Country: "",
                EndClient: masterItem["Client"] ? masterItem["Client"]["Client_x0020_Name"] : "",
                InstructionDate: masterItem["Month"] + "-" + masterItem["Year"],
                Status: masterItem["Status"]
            };
            for (let instructionCounter: number = 0; instructionCounter < clientInstructions.length; instructionCounter++) {
                instructinLookupId = clientInstructions[instructionCounter]["InstructionMaster"]?clientInstructions[instructionCounter]["InstructionMaster"]["Id"]:0;
                if (instructionMasterItemId == instructinLookupId) {
                    item.Country = clientInstructions[instructionCounter]["Country"]?clientInstructions[instructionCounter]["Country"]["Title"]:"";
                }
            }
            instructionListItems.push(item);

        }
        return instructionListItems;
    }
}