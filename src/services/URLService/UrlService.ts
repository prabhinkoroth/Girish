 import {UrlQueryParameterCollection} from "@microsoft/sp-core-library";
 export interface IUrlService{
     getQueryString:(key:string)=>string;
     updateQueryStringInUrl(uri:string, key:string,value:string):string;
 }
 export class UrlService implements IUrlService{
    public _urlParameterCollection:UrlQueryParameterCollection;
     constructor() {
        
         this._urlParameterCollection=new UrlQueryParameterCollection(window.location.href);
     }
     public getQueryString (key: string) {
         return this._urlParameterCollection.getValue(key);
     }
     public updateQueryStringInUrl(uri:string, key:string,value:string):string{
        
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
              return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
              return uri + separator + key + "=" + value;
            }
          
     }

 }