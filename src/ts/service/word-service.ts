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

function sort(sorts: string[], array: any[]) {
	if (array && array.length > 0 && sorts && sorts.length > 0) {
		array.sort((a, b) => {
			return sortsCompare(sorts, 0, a, b);
		});
	}
}

function sortsCompare(sorts: string[], i: number, a, b) {
	if (sorts[i]) {
		let ss = sorts[i].split(',');
		let v = ss[0];
		let av = a[v], bv = b[v];
		let c = ss.length <= 1 || 'asc' == ss[1].toLowerCase() ? 1 : -1;
		let r;
		if (isNaN(av) && isNaN(bv)) {
			r = av.localeCompare(bv);
		} else {
			r = av > bv ? 1 : av == bv ? 0 : -1;
		}
		if (r == 0) {
			r = sortsCompare(sorts, i + 1, a, b);
		}
		return r * c;
	} else {
		return 0;
	}
}

/**
 */
export class WordService {

	@AjaxTryCatch(1)
	public static findAll(formData, callback: IAjaxManagerResultCallback<Word[]>) {
		sort(formData.sort, Words);
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
		let old = WordMap[formData.word];
		delete WordMap[formData.word];
		let index = Words.indexOf(formData);
		if (index != -1) {
			Words.splice(index, 1);
		}
		callback({ success: true });
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
