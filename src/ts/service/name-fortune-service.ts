import { NameFortunes, NameNumFortunes } from "ts/data/word/name-fortunes";
import { NameFortune } from "ts/data/entity/entity";
import { IAjaxManagerResultCallback } from "@cui/core";
import { SortUtil } from "ts/util/sort-util";
import { Asserts } from "ts/util/asserts";
import { WordService } from "./word-service";

export const FirstNameFortunes = {};

export const NameNumFortunesMap = {};

NameFortunes.forEach(f => {
    let array;
    if (!(array = FirstNameFortunes[f.num[0]])) {
        array = (FirstNameFortunes[f.num[0]] = []);
    }
    array.push(f);
});

NameNumFortunes.forEach(f => {
    NameNumFortunesMap[f.num] = f;
});

export class NameFortuneService {
    public static findAll(formData, callback: IAjaxManagerResultCallback<NameFortune[]>) {
        SortUtil.sort(formData.sort, NameFortunes);
        callback({ success: true, data: NameFortunes });
    }

    public static find(firstName: string, callback: IAjaxManagerResultCallback<NameFortune[]>) {
        Asserts.notEmpty(firstName, '姓氏不能為空');
        Asserts.isTrue(firstName.length <= 2, '姓氏最大長度為2');
        WordService.find(firstName, (result) => {
            if (!result.success) {
                callback({ success: true, message: result.message });
            }
            let count;
            let ws = result.data;
            if (ws.length > 1) {
                // 複數姓
                if (!ws[0]) {
                    callback({ success: false, message: firstName[0] + ' 找不到' });
                }
                if (!ws[1]) {
                    callback({ success: false, message: firstName[1] + ' 找不到' });
                }
                count = ws[0].num + ws[1].num;
            } else {
                //單數姓
                if (!ws[0]) {
                    callback({ success: false, message: firstName[0] + ' 找不到' });
                }
                count = 1 + ws[0].num;
            }
            callback({ success: true, data: FirstNameFortunes[count] });
        });
    }

    public static findByNum(num: number, callback: IAjaxManagerResultCallback<NameFortune[]>) {
        Asserts.notNull(num, 'num' + Asserts.NotNullMessage);
        callback({ success: true, data: FirstNameFortunes[num] });
    }
}

// http://www.360doc.com/content/11/0611/12/5873852_126193502.shtml
function parse() {
    var NameFortunes = [];
    document.querySelectorAll('tr').forEach(t => {
        let tds = t.querySelectorAll('td');
        if (tds.length == 2) {
            let ps = tds.item(0).querySelectorAll('p');
            if (ps.length == 3) {
                let content = tds.item(1).querySelectorAll('p').item(0).innerText;
                let luck;
                let start = content.indexOf('【');
                if (start == -1) {
                    luck = tds.item(1).querySelectorAll('p').item(1).innerText;
                } else {
                    let end = content.indexOf('】');
                    luck = content.substring(start, end);
                    content = content.substring(0, start);
                }
                luck = luck.replace(/【|】/g, '');
                NameFortunes.push({
                    num: replace(ps.item(0).innerText)
                    , type: ps.item(1).innerText
                    , content: replace(content)
                    , luck: replace(luck)
                });
                NameFortunes.push({
                    num: replace(ps.item(2).innerText)
                    , type: ps.item(1).innerText
                    , content: replace(content)
                    , luck: replace(luck)
                });
            }
        }

        function replace(value) {
            return value.replace(/０|１|２|３|４|５|６|７|８|９|＋|－/g, function (value) {
                var num = {
                    '０': '0'
                    , '１': '1'
                    , '２': '2'
                    , '３': '3'
                    , '４': '4'
                    , '５': '5'
                    , '６': '6'
                    , '７': '7'
                    , '８': '8'
                    , '９': '9'
                    , '＋': '+'
                    , '－': '-'
                };
                return num[value];
            });
        }
    });

    console.log(NameFortunes);
}

//https://kknews.cc/zh-tw/astrology/2elm6r.html
function parse2() {
    var array = [];
    document.querySelectorAll('div p').forEach(p => {
        var text = p.innerHTML;
        if (/第\d+數暗示意義為/.test(text)) {
            array.push({
                num: Number(text.replace(/(第)(\d+)(數暗示意義為).+/, '$2'))
                , content: text.replace(/.+）(.+)。.+$/, '$1')
                , luck: text.replace(/.+（(.+)）$/, '$1')
            });
        }
    });
    console.log(array)
}