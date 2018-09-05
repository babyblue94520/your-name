import { Word } from 'ts/data/entity/entity';

declare var Words: any;

/**
 */
export class WordService {
	/**
	 * @param {String} word 文字
	 * @return {Object} wordObject
	 */
	public static getWord(word): Word {
		return Words[word];
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
			result.push(Words[words[k]]);
		}
		return result;
	}
}
