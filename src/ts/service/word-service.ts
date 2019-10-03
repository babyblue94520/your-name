import { Asserts } from 'ts/util/asserts';
import { IAjaxManagerResultCallback, AjaxTryCatch } from '@cui/core';
import { Word, WordHome, FiveTypeWords } from 'ts/constant/word';



/**
 */
export class WordService {

	@AjaxTryCatch(1)
	public static findAll(formData, callback: IAjaxManagerResultCallback<Word[]>) {
		// SortUtil.sort(formData.sort, Words);
		callback({ success: true, data: WordHome.words });
	}

	@AjaxTryCatch(1)
	public static modify(formData: Word, callback: IAjaxManagerResultCallback) {
		Asserts.notNull(formData, 'data' + Asserts.NotNullMessage);
		Asserts.notEmpty(formData.word, 'word' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.type, 'type' + Asserts.NotEmptyMessage);
		Asserts.notNull(formData.num, 'num' + Asserts.NotNullMessage);
		let old = WordHome.wordMap[formData.word];
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
		let index = WordHome.words.indexOf(formData);
		if (index != -1) {
			WordHome.words.splice(index, 1);
		}
		console.log(index, formData, WordHome.words);
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
			array.push(WordHome.wordMap[word[i]]);
		}
		callback({ success: true, data: array });
	}

	@AjaxTryCatch(1)
	public static findNumType(nums: any[], callback: IAjaxManagerResultCallback<FiveTypeWords[]>) {
		Asserts.notNull(nums, '筆劃不可為空');
		let array = [];
		for (var i in nums) {
			array.push(WordHome.wordByNumType[nums[i]]);
		}
		callback({ success: true, data: array });
	}

	/**
	 * @param {String} word 文字
	 * @return {Object} wordObject
	 */
	public static getWord(word): Word {
		return WordHome.wordMap[word];
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
			result.push(WordHome.wordMap[words[k]]);
		}
		return result;
	}
}
