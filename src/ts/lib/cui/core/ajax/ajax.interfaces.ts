import { AjaxMethod } from './ajax.enums';
import { AjaxHeaders } from './ajax.beans';


export interface IAjaxNameValuePair {
  name: string;
  value: any;
}
export interface IAjaxCallback {
  (xhr: XMLHttpRequest, e: ProgressEvent);
}
export interface IAjaxManagerResult {
  success: boolean;
  // 錯誤訊息
  message?: string;
  // 該請求成功返回的資料
  data?: any;
  // 返回時，需要額外刷新的資料
  refresh?: any;
  // 回傳資料需要參考的其他資料
  joins?: any;
  // 參數各別錯誤訊息
  errors?: any;
}
export interface IAjaxManagerResultCallback {
  (result: IAjaxManagerResult);
}
export interface IAjaxConfig {
  upload?: boolean;
  isPHP?: boolean;
  url: string;
  method?: AjaxMethod;
  async?: boolean | undefined;
  data?: string | IAjaxNameValuePair[] | object | undefined;
  dataType?: string;
  headers?: AjaxHeaders | undefined;
  timeout?: number | undefined;
  callback?: IAjaxCallback | IAjaxManagerResultCallback | undefined;
  progress?: IAjaxCallback | undefined;
}
