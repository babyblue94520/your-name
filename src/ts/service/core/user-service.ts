import { AjaxMethod, AjaxTryCatch, CUI } from '@cui/core';
import { ApiPath } from '../../constant/API';
import { Asserts } from '../../util/asserts';
import { BasicService } from './basic-service';
import { environment } from '@environment';
import { Global } from '../../globle';
import { JSEncrypt } from 'jsencrypt';

/**
 * 超級管理使用者
 */
export class UserService {
	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.UserQueryPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 註冊
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static add(formData, callback) {
		Asserts.notEmpty(formData.id, 'account' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.password, 'password' + Asserts.NotEmptyMessage);
		Asserts.notLess(formData.newPassword, environment.passwordLength, 'new password' + Asserts.NotLessMessage + environment.passwordLength);

		let _formData = CUI.deepClone(formData);
		// 先取得公鑰
		BasicService.wowKey(function (result) {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				// 加密密碼
				_formData.password = jsencrypt.encrypt(_formData.password);
				Global.ajaxManager.request({
					url: ApiPath.UserAdd,
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
	 * 修改
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static modify(formData, callback) {
		Asserts.notEmpty(formData.id, 'account' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.UserModify,
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
	public static modifyPassword(formData, callback) {
		Asserts.notEmpty(formData.password, 'password' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.newPassword, 'new password' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.confirmPassword, 'confirm password' + Asserts.NotEmptyMessage);
		Asserts.notLess(formData.newPassword, environment.passwordLength, 'new password' + Asserts.NotLessMessage + environment.passwordLength);
		Asserts.notEquals(formData.password, formData.newPassword, 'password and new password' + Asserts.CanNotSame);
		Asserts.isEquals(formData.newPassword, formData.confirmPassword, 'new password and confirm password' + Asserts.NotSame);

		let _formData = CUI.deepClone(formData);
		// 先取得公鑰
		BasicService.wowKey(function (result) {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				// 加密密碼
				_formData.password = jsencrypt.encrypt(_formData.password);
				_formData.newPassword = jsencrypt.encrypt(_formData.newPassword);
				Global.ajaxManager.request({
					url: ApiPath.UserModifyPassword,
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
	 * 重設密碼
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static resetPassword(formData, callback) {
		Asserts.notEmpty(formData.id, 'account' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.UserResetPassword,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
}
