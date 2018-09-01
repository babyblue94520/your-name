import { AjaxMethod, AjaxTryCatch } from '@cui/core';
import { ApiPath } from '../../constant/API';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';

/**
 * 頁面
 */
export class RouteService {
	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static query(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.RouteQuery,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static queryFolder(callback) {
		Global.ajaxManager.request({
			url: ApiPath.RouteFolder,

			callback: callback
		});
	}

	/**
	 * 新增
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static add(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.RouteAdd,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 修改
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static modify(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.RouteModify,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
	/**
	 * 刪除
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static remove(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.RouteRemove,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
}
