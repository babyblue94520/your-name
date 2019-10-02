import { Word } from 'ts/data/entity/entity';
import { Asserts } from 'ts/util/asserts';
import { IAjaxManagerResultCallback, AjaxTryCatch } from '@cui/core';

declare var Words: Word[];
interface IWordMap {
	[key: string]: Word
}
var WordMap: IWordMap = {};

Words.forEach(w => {
	WordMap[w.word] = w;
});


/**
 */
export class WordService {

	@AjaxTryCatch(1)
	public static findAll(formData, callback: IAjaxManagerResultCallback<Word[]>) {
		// SortUtil.sort(formData.sort, Words);
		callback({ success: true, data: Words });
	}

	@AjaxTryCatch(1)
	public static modify(formData: Word, callback: IAjaxManagerResultCallback) {
		Asserts.notNull(formData, 'data' + Asserts.NotNullMessage);
		Asserts.notEmpty(formData.word, 'word' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.type, 'type' + Asserts.NotEmptyMessage);
		Asserts.notNull(formData.num, 'num' + Asserts.NotNullMessage);
		let old = WordMap[formData.word];
		if (!old) {
			throw new Error(formData.word + ' not exist;');
		}
		old.type = formData.type;
		old.sound = formData.sound;
		old.content = formData.content;
		if (old.num != formData.num) {
			old.num = formData.num;
			// Words.sort((a, b) => {
			// 	return a.num > b.num ? 1 : a.num == b.num ? 0 : -1;
			// });
		}
		callback({ success: true });
	}


	@AjaxTryCatch(1)
	public static remove(formData: Word, callback: IAjaxManagerResultCallback) {
		Asserts.notNull(formData, 'data' + Asserts.NotNullMessage);
		Asserts.notEmpty(formData.word, 'word' + Asserts.NotEmptyMessage);
		delete WordMap[formData.word];
		let index = Words.indexOf(formData);
		if (index != -1) {
			Words.splice(index, 1);
		}
		console.log(index, formData, Words);
		callback({ success: true });
	}

	/**
	 * @param {String} word 文字
	 * @return {Object} wordObject
	 */
	@AjaxTryCatch(1)
	public static find(word: any, callback: IAjaxManagerResultCallback<Word[]>) {
		Asserts.notEmpty(word, 'word' + Asserts.NotEmptyMessage);
		let array = [];
		for (var i in word) {
			array.push(WordMap[word[i]]);
		}
		callback({ success: true, data: array });
	}

	/**
	 * @param {String} word 文字
	 * @return {Object} wordObject
	 */
	public static getWord(word): Word {
		return WordMap[word];
	}

	/**
	 * @param {Array} word 文字
	 * @return {Array} wordObject
	 */
	public static getWords(words: string[]): Word[] {
		if (!words || words.length == 0) {
			return null;
		}
		let result = [];
		for (let k in words) {
			result.push(WordMap[words[k]]);
		}
		return result;
	}
}
