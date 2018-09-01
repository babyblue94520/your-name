import { Asserts } from '../../util/asserts';
import { AjaxTryCatch, AjaxMethod } from '@cui/core';
import { Global } from '../../globle';
import { ApiPath } from '../../constant/API';

/**
 * 伺服器代理發送請求
 */
export class ProxyService {
	/**
	 * 使用GET由伺服器代發請求
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static get(formData, callback) {
		Asserts.notEmpty(formData.url, 'url' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.Proxy,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 使用POST由伺服器代發請求
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static post(formData, callback) {
		Asserts.notEmpty(formData.url, 'url' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.Proxy,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
}
