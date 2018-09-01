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
import { AuthorityCombobox } from './authority-service';
import { Global } from '../../globle';


export interface AuthorityCombobox extends Combobox {
	level: number;
}

/**
 * 權限等級
 */
export class AuthorityService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AuthorityQueryPage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 查詢權限等級下拉選單
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static combobox(callback: ComboboxCallback<ComboboxData<AuthorityCombobox>>) {
		Global.ajaxManager.request({
			url: ApiPath.AuthorityQueryComboboxData,
			callback: function (result) {
				if (!result.success) {
					alert(AjaxUtil.getMessage(result));
					callback({ array: [], map: {} });
					return;
				}
				let array: AuthorityCombobox[] = result.data;
				let data: AuthorityCombobox;
				for (let i in array) {
					data = array[i];
					data.name = data.name + '(' + data.level + ')';
				}
				callback({ array: array, map: CUI.comboboxToValueName(array) });
			}
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
		Asserts.notEmpty(formData.level, 'level' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.AuthorityAdd,
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
		Asserts.notEmpty(formData.level, 'level' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.AuthorityModify,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 刪除平台商戶
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static remove(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.AuthorityRemove,
			method: AjaxMethod.POST,
			data: formData,
			callback: callback
		});
	}

}
