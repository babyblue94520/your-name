import { Fortunes } from '../data/word/fortunes';
import { WordsByNum } from 'ts/data/word/words-by-num';
import { Fortune, Word, GoodName } from 'ts/data/entity/entity';


export class FortuneService {
	// 相生
	private static create = ['木', '火', '土', '金', '水'];

	private static count = 0;

	/**
	 * 找出筆畫運勢
	 * @param {Integer} num 文字
	 * @return {Object} fortune Object
	 */
	public static getFortuneByNum(num): Fortune {
		return Fortunes[num - 1];
	}

	/**
	 * 找出筆畫字數組合陣列
	 * @param total
	 * @param count
	 */
	public static getNumGroup(total: number, count: number): number[][] {
		if (count <= 0) {
			alert('至少一個字！');
			return;
		}
		if (count == 1) {
			return [[total]];
		}
		FortuneService.count = 0;
		let result = [];
		let start = 1;
		let end = Math.floor(total / count);
		let lastIndex = count - 1;
		FortuneService.next(result, start, end, [], total, lastIndex);
		console.log('getNumGroup', FortuneService.count, result.length);
		return result;
	}

	/**
	 * 取得五行相生的下一個屬性
	 * @param type
	 */
	public static getNextType(type: string): string {
		return FortuneService.create[(FortuneService.create.indexOf(type) + 1) % 5];
	}

	/**
	 * 取得最好的下一個字組
	 * @param num 筆畫
	 * @param type 屬性
	 */
	public static getGoodNextWords(num, type): Word[] {
		return WordsByNum[num][type] || [];
	}

	/**
	 * 依次算完，跑很慢，會死雞
	 * @param word
	 * @param group
	 * @param wordsByNum
	 */
	public static getGoodNames(word: Word, group: number[], wordsByNum) {
		let count = 0;
		let create = ['木', '火', '土', '金', '水'];
		let tempNames: GoodName[] = [{
			name: word.word,
			type: word.type
		}];
		let nextType = word.type;
		let words;
		let names: GoodName[] = [];
		for (let i = 1; i < group.length; i++) {
			nextType = create[(create.indexOf(nextType) + 1) % 5];
			words = wordsByNum[group[i]][nextType] || [];
			if (words.length == 0) {
				count++;
				return [];
			}
			console.log(nextType, words.length, tempNames.length);
			for (let w in words) {
				for (let n in tempNames) {
					count++;
					names.push({
						name: tempNames[n].name + words[w].word,
						type: tempNames[n].type + ' 生 ' + words[w].type,
					});
				}
			}
			tempNames = names;
			console.log(tempNames.length);
			names = [];
		}
		console.log('getGoodNames', count, names.length);
		return tempNames;

	}


	/**
	 * 搜尋下一個數字
	 * @param result
	 * @param start
	 * @param end
	 * @param temp
	 * @param remain
	 * @param lastIndex
	 */
	private static next(result: number[][], start: number, end: number, temp: number[], remain: number, lastIndex: number) {
		let nextTemp;
		if (temp.length == lastIndex) {
			FortuneService.count++;
			nextTemp = Object.assign([], temp);
			nextTemp.push(remain);
			result.push(nextTemp);
		} else {
			for (let i = start; i <= end; i++) {
				if (i > remain - i) {
					FortuneService.count++;
					break;
				}
				FortuneService.count++;
				nextTemp = Object.assign([], temp);
				nextTemp.push(i);
				FortuneService.next(result, i + 1, end, nextTemp, remain - i, lastIndex);
			}
		}
	}


	/**
	 * 忘記是爬哪個網站的規則了
	 */
	public static parseData() {
		let dataArr = document.querySelector('div').innerHTML.replace(/\s+/g, '：').replace(/\\r\\n/g, '：').replace(/：+/g, '：').split('：');
		console.log(dataArr);
		let reg1 = /^(\d+)畫/;
		let reg2 = /^五行屬「(.)」的字有/;
		let dictionary = new Object();
		let m1, m2, obj = new Object();
		let index1, index2;

		for (let i in dataArr) {
			if (!dataArr[i]) { continue; }
			m1 = dataArr[i].match(reg1);
			if (m1) {
				if (index1) {
					dictionary[index1] = obj;
				}
				index1 = m1[1];
				obj = new Object();
				continue;
			}

			m2 = dataArr[i].match(reg2);
			if (m2) {
				index2 = m2[1];
				obj[index2] = [];
				continue;
			}
			obj[index2] = obj[index2].concat(dataArr[i].split(''));
		}
		console.log('let dictionary = ' + JSON.stringify(dictionary) + ';');
	}
}

