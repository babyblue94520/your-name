import { Global } from '../../globle';
import { ApiPath } from '../../constant/API';
import { AjaxMethod, AjaxTryCatch } from '@cui/core';

/**
 * 系統訪問紀錄
 */
export class AccessLogService {
	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AccessLogQueryPage,

			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static groupPage(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AccessLogQueryGroupPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static detilPage(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AccessLogQueryDetilPage,

			data: formData,
			callback: callback
		});
	}

	/**
	 * 刪除紀錄
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static remove(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AccessLogDelete,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
}
