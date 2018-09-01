import {
	AjaxMethod,
	AjaxTryCatch,
	Combobox,
	ComboboxCallback,
	ComboboxData,
	CUI
} from '@cui/core';
import { AjaxUtil } from '../../lib/cui/core/ajax/ajax-util';
import { ApiPath } from '../../constant/API';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';

export interface AuthorityGroupCombobox extends Combobox {
	level: number;
}
/**
 * 權限群組
 */
export class AuthorityGroupService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AuthorityGroupQueryPage,
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
		Asserts.notEmpty(formData.name, 'name' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.authorityId, 'authorityId' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.AuthorityGroupAdd,
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
		Asserts.notEmpty(formData.name, 'name' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.authorityId, 'authorityId' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.AuthorityGroupModify,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢權限等級下拉選單
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static combobox(callback: ComboboxCallback<ComboboxData<AuthorityGroupCombobox>>) {
		Global.ajaxManager.request({
			url: ApiPath.AuthorityGroupQueryComboboxData,
			callback: function (result) {
				if (!result.success) {
					alert(AjaxUtil.getMessage(result));
					callback({ array: [], map: {} });
					return;
				}
				let array: AuthorityGroupCombobox[] = result.data;
				let data: AuthorityGroupCombobox;
				for (let i in array) {
					data = array[i];
					data.name = data.name + '(' + data.level + ')';
				}
				callback({ array: array, map: CUI.comboboxToValueName(array) });
			}
		});
	}
}
