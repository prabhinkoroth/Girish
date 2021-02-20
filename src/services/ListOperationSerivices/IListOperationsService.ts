
import { IItem, IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";

import * as pnp from "@pnp/sp/presets/all";
import { IField, IFileAddResult, IFolder } from "@pnp/sp/presets/all";


export interface IListOperationService{
    AddItemsToList:(listName:string,item:any)=>Promise<IItemAddResult>;
    UpdateItemInList:(listName:string,itemId:number,item:any)=>Promise<IItemUpdateResult>;
    DeleteItemFromList:(listName:string,itemId:number)=>Promise<void>;
    GetAllItemsFromList:(listName:string,filter:string,select:string[],expand:string[])=>Promise<any>;
    GetListField:(listName:string,fieldName:string)=>Promise<IField>;
    GetItemById(listName:string,id:number):Promise<IItem>;
    AddItemsToDocumentLibrary(documentLibraryServerRelativeUrl: string, fileName: string, content: any,properties:any): Promise<IFileAddResult> ;
}


export class ListOperationService implements IListOperationService {
  public async DeleteItemFromList(listName: string, itemId: number): Promise<void> {
    return await pnp.sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
  }
  public async AddItemsToList(listName: string, item: any): Promise<IItemAddResult> {
    let result: IItemAddResult = await pnp.sp.web.lists.getByTitle(listName).items.add(item);
    return result;
  }
  public async UpdateItemInList(listName: string, itemId: number, item: any): Promise<IItemUpdateResult> {
    let result: IItemUpdateResult = await pnp.sp.web.lists.getByTitle(listName).items.getById(itemId).update(item);
    return result;
  }
  public async GetAllItemsFromList(listName: string, filter: string = "", select: string[] = [], expand: string[] = []): Promise<any> {
    let items = pnp.sp.web.lists.getByTitle(listName).items;
    if (filter != "") {
      items = items.filter(filter);
    }
    if (expand.length > 0) {
      items = items.expand(...expand);
    }
    if (select.length > 0) {
      items = items.select(...select);
    }
    return items.getAll(5000);

  }
  public async GetItemById(listName:string,id:number):Promise<IItem>{
   return await pnp.sp.web.lists.getByTitle(listName).items.getById(id).get();
  }
  public async GetListField(listName: string, fieldName: string): Promise<IField> {

    return await pnp.sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldName).get();

  }
  public async AddItemsToDocumentLibrary(documentLibraryServerRelativeUrl: string, fileName: string, content: any, properties: any = null): Promise<IFileAddResult> {
    debugger;
    let fileResult:IFileAddResult = await pnp.sp.web.getFolderByServerRelativeUrl(documentLibraryServerRelativeUrl).files.add(fileName, content, true);
    
    if (properties != null) {
      debugger;
      let item: IItem = await fileResult.file.getItem();
      debugger;
      await item.update(properties);
    }
    return fileResult;


  }


}