import { CUI, AjaxMethod, AjaxTryCatch } from '@cui/core';
import { Global } from '../../globle';
import { ApiPath } from '../../constant/API';
import { Asserts } from '../../util/asserts';

/**
 * 權限群組可訪問端口
 */
export class AuthorityGroupPermissionService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static query(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.AuthorityGroupPermissionQuery,
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
			url: ApiPath.AuthorityGroupPermissionModify,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}
}
