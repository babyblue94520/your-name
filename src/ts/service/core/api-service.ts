import { Asserts } from '../../util/asserts';
import { AjaxTryCatch, AjaxMethod } from '@cui/core';
import { Global } from '../../globle';
import { ApiPath } from '../../constant/API';

/**
 * 端口
 */
export class ApiService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static query(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.ApiQuery,
			data: formData,
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
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.ApiAdd,
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
			url: ApiPath.ApiModify,
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
			url: ApiPath.ApiRemove,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
}
