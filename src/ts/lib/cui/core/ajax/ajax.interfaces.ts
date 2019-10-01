import { AjaxMethod } from './ajax.enums';
import { AjaxHeaders } from './ajax.beans';

/**
 * 佇列請求
 */
export interface IAjaxQueue {
  id: string; // scope id
  concurrent: number; // 同時執行幾個請求
  errorStop?: boolean; // success=false 是否停止
}

export interface IAjaxNameValuePair {
  name: string;
  value: any;
}
export interface IAjaxCallback {
  (xhr: XMLHttpRequest, e: ProgressEvent);
}
export interface IAjaxManagerResult<T = any, V= any, K= any, Y= any> {
  success: boolean;
  // 錯誤訊息
  message?: string;
  // 該請求成功返回的資料
  data?: T;
  // 返回時，需要額外刷新的資料
  refresh?: V;
  // 回傳資料需要參考的其他資料
  joins?: K;
  // 參數各別錯誤訊息
  errors?: Y;
}
export interface IAjaxManagerResultCallback<T= any, V= any, K= any, Y= any> {
  (result: IAjaxManagerResult<T, V, K, Y>, e?: ProgressEvent);
}
export interface IAjaxConfig {
  upload?: boolean;
  isPHP?: boolean;
  url: string;
  method?: AjaxMethod;
  async?: boolean;
  data?: string | IAjaxNameValuePair[] | object;
  dataType?: string;
  headers?: AjaxHeaders;
  timeout?: number;
  callback?: IAjaxCallback;
  progress?: IAjaxCallback;
  background?: boolean;
}
export interface IAjaxManageConfig<T= any, V= any, K= any, Y= any> {
  upload?: boolean;
  isPHP?: boolean;
  url: string;
  method?: AjaxMethod;
  async?: boolean;
  data?: string | IAjaxNameValuePair[] | object;
  dataType?: string;
  headers?: AjaxHeaders;
  timeout?: number;
  callback?: IAjaxManagerResultCallback<T, V, K, Y>;
  progress?: IAjaxCallback;
  background?: boolean;
  queue?: IAjaxQueue;
}
