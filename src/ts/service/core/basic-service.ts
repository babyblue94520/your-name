import { AjaxMethod, AjaxTryCatch, CUI } from '@cui/core';
import { ApiPath } from '../../constant/API';
import { Asserts } from '../../util/asserts';
import { FeatureNode } from '../../data/node/common';
import { Global } from '../../globle';
import { JSEncrypt } from 'jsencrypt';

/**
 * 基本服務
 */
export class BasicService {
	/**
	 * 初始化
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static init(callback?) {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGiveInit,
			callback: callback
		});
	}

	/**
	 * 取得特徵key
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static featureKey(callback) {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGiveFeatureKey,
			method: AjaxMethod.POST,
			callback: callback
		});
	}

	/**
	 * 透過特徵key取得公鑰
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static wowKey(callback) {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGiveWowKey,
			method: AjaxMethod.POST,
			data: { feature: FeatureNode.get() },
			callback: callback
		});
	}


	/**
	 * 登錄
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static login(formData, callback) {
		Asserts.notEmpty(formData.account, 'account' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.password, 'password' + Asserts.NotEmptyMessage);
		let _formData = CUI.deepClone(formData);
		// 先取得公鑰
		BasicService.wowKey((result) => {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				_formData.password = jsencrypt.encrypt(_formData.password);
				Global.ajaxManager.request({
					url: ApiPath.EmperorGiveLogin,
					method: AjaxMethod.POST,
					data: _formData,
					callback: callback
				});
			} else {
				BasicService.featureKey(() => {
					callback(result);
				});
			}
		});
	}

	/**
	 * 登出
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static logout(callback?) {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGiveLogout,
			method: AjaxMethod.POST,
			callback: callback
		});
	}

	/**
	 * 刷新
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static refresh(callback?) {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGiveRefresh,
			callback: callback
		});
	}
}
