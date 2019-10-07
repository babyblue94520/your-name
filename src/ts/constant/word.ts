
export interface Word {
    num: number;
    word: string;
    sound: string;
    content: string;
    type: string;
}

export interface IWordMap {
    [key: string]: Word;
}
export interface IWordByNumType {
    [key: string]: FiveTypeWords;
}

export interface FiveTypeWords {
    '木': Word[];
    '火': Word[];
    '土': Word[];
    '金': Word[];
    '水': Word[];
}

declare var Words: Word[];

export abstract class WordHome {
    public static words: Word[] = Words;
    public static wordMap: IWordMap = {};
    public static wordByNumType: IWordByNumType = {};
}

Words.forEach(w => {
    WordHome.wordMap[w.word] = w;
    if (w.type) {
        let types = WordHome.wordByNumType[w.num];
        if (!types) {
            types = (WordHome.wordByNumType[w.num] = {
                '木': []
                , '火': []
                , '土': []
                , '金': []
                , '水': []
            });
        }
        types[w.type].push(w);
    }
});
