import { AjaxDataType, AjaxMethod, IAjaxManagerResultCallback, AjaxHeaders, AjaxUtil } from '@cui/core';
import { ApiPath } from '../../constant/API';
import { Global } from '../../globle';


/**
 *
 */
export class BootService {

	/**
	 * 查詢metrics
	 * @param form
	 * @param callback
	 */
	public static metrics(url: string, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.BootSystemMetrics,
			dataType: AjaxDataType.JSON,
			callback: callback
		});
	}

	/**
	 * 查詢endpoints
	 * @param form
	 * @param callback
	 */
	public static mappings(url: string, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.BootSystemMappings,
			dataType: AjaxDataType.JSON,
			callback: callback
		});
	}

	/**
	 * 查詢logger level
	 * @param form
	 * @param callback
	 */
	public static loggers(url: string, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.BootSystemLoggers,
			dataType: AjaxDataType.JSON,
			callback: callback
		});
	}

	/**
	 * 查詢logger level
	 * @param form
	 * @param callback
	 */
	public static modifyLoggers(url: string, loggerPackage: string, data, callback: IAjaxManagerResultCallback) {
		Global.ajaxManager.request({
			url: url + ApiPath.BootSystemLoggers + '/' + loggerPackage,
			method: AjaxMethod.POST,
			headers: AjaxUtil.ContentTypeJson,
			dataType: AjaxDataType.TEXT,
			data: JSON.stringify(data),
			callback: callback
		});
	}
}
