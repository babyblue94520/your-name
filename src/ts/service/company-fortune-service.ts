import { CompanyFortune } from 'ts/data/entity/entity';
import { CompanyFortunes } from 'ts/data/word/company-fortunes';
import { Word, WordHome } from 'ts/constant/word';

export class CompanyFortuneService {
	// 相生
	private static create = ['木', '火', '土', '金', '水'];

	public static getFortunes() {
		return CompanyFortunes;
	}

	/**
	 * 找出筆劃運勢
	 * @param {Integer} num 文字
	 * @return {Object} fortune Object
	 */
	public static getFortuneByNum(num): CompanyFortune {
		return CompanyFortunes[num - 1];
	}

	/**
	 * 找出筆劃字數組合陣列
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
		let result = [];
		let start = 1;
		let end = Math.floor(total / count);
		let lastIndex = count - 1;
		CompanyFortuneService.next(result, start, end, [], total, lastIndex);
		return result;
	}

	/**
	 * 取得五行相生的下一個屬性
	 * @param type
	 */
	public static getNextType(type: string): string {
		return CompanyFortuneService.create[(CompanyFortuneService.create.indexOf(type) + 1) % 5];
	}

	/**
	 * 取得最好的下一個字組
	 * @param num 筆劃
	 * @param type 屬性
	 */
	public static getGoodNextWords(num, type): Word[] {
		return WordHome.wordByNumType[num][type] || [];
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
			nextTemp = Object.assign([], temp);
			nextTemp.push(remain);
			result.push(nextTemp);
		} else {
			for (let i = start; i <= end; i++) {
				if (i > remain - i) {
					break;
				}
				nextTemp = Object.assign([], temp);
				nextTemp.push(i);
				CompanyFortuneService.next(result, i + 1, end, nextTemp, remain - i, lastIndex);
			}
		}
	}


	/**
	 * 忘記是爬哪個網站的規則了
	 */
	public static parseData() {
		let dataArr = document.querySelector('div').innerHTML.replace(/\s+/g, '：').replace(/\\r\\n/g, '：').replace(/：+/g, '：').split('：');
		console.log(dataArr);
		let reg1 = /^(\d+)劃/;
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

