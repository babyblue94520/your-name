import { NameFortunes, NameNumFortunes, NameFortuneSociality, NameFortuneBasics, NameFortuneSuccess, NameSicks } from 'ts/data/word/name-fortunes';
import { NameFortune, NameNumFortune, NameFortuneOther, NameFortuneSick } from 'ts/data/entity/entity';
import { IAjaxManagerResultCallback } from '@cui/core';
import { SortUtil } from 'ts/util/sort-util';
import { Asserts } from 'ts/util/asserts';
import { WordService } from './word-service';

interface INameFortunesMap {
    [key: string]: NameFortune;
}
interface INameNumFortunesMap {
    [key: string]: NameNumFortune;
}

interface INameFortuneOtherMap {
    [key: string]: NameFortuneOther;
}

interface INameFortuneSickMap {
    [key: string]: NameFortuneSick;
}

export const NameFortunesMap: INameFortunesMap = {};
export const FirstTypeFortunes = {};

export const NameNumFortunesMap: INameNumFortunesMap = {};

export const NameFortuneBasicsMap: INameFortuneOtherMap = {};
export const NameFortuneSuccessMap: INameFortuneOtherMap = {};
export const NameFortuneSocialityMap: INameFortuneOtherMap = {};
export const NameFortuneSickMap: INameFortuneSickMap = {};

NameFortunes.forEach(f => {
    let array;
    if (!(array = FirstTypeFortunes[f.type[0]])) {
        array = (FirstTypeFortunes[f.type[0]] = []);
    }
    array.push(f);
    NameFortunesMap[f.type] = f;
});

NameNumFortunes.forEach(f => {
    NameNumFortunesMap[f.num] = f;
});

NameFortuneBasics.forEach(f => {
    NameFortuneBasicsMap[f.type] = f;
});
NameFortuneSuccess.forEach(f => {
    NameFortuneSuccessMap[f.type] = f;
});
NameFortuneSociality.forEach(f => {
    NameFortuneSocialityMap[f.type] = f;
});
NameSicks.forEach(f => {
    NameFortuneSickMap[f.type] = f;
});
export const NumTypes = ['水', '木', '木', '火', '火', '土', '土', '金', '金', '水'];
export const TypeNums = {
    '水': [0, 9]
    , '木': [1, 2]
    , '火': [3, 4]
    , '土': [5, 6]
    , '金': [7, 8]
};

export class NameFortuneService {
    public static findAll(formData, callback: IAjaxManagerResultCallback<NameFortune[]>) {
        SortUtil.sort(formData.sort, NameFortunes);
        callback({ success: true, data: NameFortunes });
    }

    public static findByNum(num: number, callback: IAjaxManagerResultCallback<NameFortune[]>) {
        Asserts.notNull(num, 'num' + Asserts.NotNullMessage);
        callback({ success: true, data: FirstTypeFortunes[NumTypes[num % 10]] });
    }
}

// http://www.360doc.com/content/11/0611/12/5873852_126193502.shtml
function parse() {
    let array = [];
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
                array.push({
                    num: replace(ps.item(0).innerText)
                    , type: ps.item(1).innerText
                    , content: replace(content)
                    , luck: replace(luck)
                });
                array.push({
                    num: replace(ps.item(2).innerText)
                    , type: ps.item(1).innerText
                    , content: replace(content)
                    , luck: replace(luck)
                });
            }
        }

        function replace(value) {
            return value.replace(/０|１|２|３|４|５|６|７|８|９|＋|－/g, function (arg1) {
                let num = {
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
                return num[arg1];
            });
        }
    });

    console.log(array);
}

// https://kknews.cc/zh-tw/astrology/2elm6r.html
function parse2() {
    let array = [];
    document.querySelectorAll('div p').forEach(p => {
        let text = p.innerHTML;
        if (/第\d+數暗示意義為/.test(text)) {
            array.push({
                num: Number(text.replace(/(第)(\d+)(數暗示意義為).+/, '$2'))
                , content: text.replace(/.+）(.+)。.+$/, '$1')
                , luck: text.replace(/.+（(.+)）$/, '$1')
            });
        }
    });
    console.log(array);
}
// https://m.golla.tw/xm/zs/16696_8.html
function pars3() {
    let ps = document.querySelectorAll('.maincontent p');
    let array = [];
    for (let i = 0; i < ps.length; i++) {
        let title = ps.item(i++).innerHTML;
        array.push({
            num: title.replace(/(\d+).+/, '$1')
            , luck: title.replace(/.+（(.+)）$/, '$1')
            , content: ps.item(i++).innerHTML + '\n' + ps.item(i++).innerHTML + '\n' + ps.item(i++).innerHTML + '\n' + ps.item(i++).innerHTML
        });
    }

}
