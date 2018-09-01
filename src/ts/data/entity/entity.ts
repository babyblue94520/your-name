

/**系統訪問紀錄*/
export interface AccessLog {
    /**自動編號*/
    id: number;
    /**建立時間*/
    time: number;
    /**服務名稱*/
    service: string;
    /**Session ID*/
    sessionId: string;
    /**訪問網址*/
    url: string;
    /**來源IP*/
    ip: string;
    /**來源位置*/
    location: string;
    /**請求表頭*/
    requestHeader: string;
    /**請求參數*/
    requestParameter: string;
    /**回覆表頭*/
    responseHeader: string;
    /**使用者*/
    user: string;
    /**備註*/
    remar: string;
    /**Http Status Code*/
    status: number;
}

export interface Authority {
    /**自動編號*/
    id: number;
    /**名稱*/
    name: string;
    /**層級*/
    level: number;
    /**修改人*/
    updateUser?: string;
    /**修改時間*/
    updateTime?: number;
    /**建立者*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}

/**訪問端口*/
export interface Api {
    /**端口路徑*/
    id: string;
    /**請求方法(GET、POST、PUT、DELETE)*/
    method: string;
    /**備註*/
    remark: string;
    /**啟用*/
    enabled: boolean;
    /**預設可訪問*/
    required: boolean;
    /**修改人*/
    updateUser?: string;
    /**修改時間*/
    updateTime?: number;
    /**建立人*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}

/**使用者*/
export interface User {
    /**帳號*/
    id: string;
    /**密碼*/
    password: string;
    /**名稱*/
    name: string;
    /**電子信箱*/
    email: string;
    /**單位*/
    unit: string;
    /**權限群組ID*/
    authorityGroupId: number;
    /**登錄錯誤次數*/
    loginErrorCount: number;
    /**是否凍結*/
    locked: boolean;
    /**是否啟用*/
    enabled: boolean;
    /**修改人*/
    updateUser?: string;
    /**修改時間*/
    updateTime?: number;
    /**建立人*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}

/**路由*/
export interface Route {
    /**ID*/
    id?: number;
    /**上層ID*/
    parentId: number;
    /**名稱*/
    name: string;
    /**類型*/
    type: number;
    /**路徑*/
    path: string;
    /**描述*/
    remark: string;
    /**css class name*/
    className: string;
    /**順序*/
    sort: number;
    /**啟用*/
    enabled: boolean;
    /**預設顯示*/
    required: boolean;
    /**修改人*/
    updateUser?: string;
    /**修改時間*/
    updateTime?: number;
    /**建立人*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}

/**權限群組*/
export interface AuthorityGroup {
    /**自動編號*/
    id: number;
    /**名稱*/
    name: string;
    /**權限ID*/
    authorityId: number;
    /**權限等級*/
    authorityLevel: number;
    /**啟用*/
    enabled: boolean;
    /**修改人*/
    updateUser?: string;
    /**修改時間*/
    updateTime?: number;
    /**建立者*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}


/**權限群組可訪問API*/
export interface AuthorityGroupApi {
    /**群組ID*/
    id: number;
    /**API ID*/
    apiId: string;
    /**建立人*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}

/**權限群組可訪問頁面*/
export interface AuthorityGroupRoute {
    /**群組ID*/
    id: number;
    /**路由ID*/
    routeId: string;
    /**建立人*/
    createUser?: string;
    /**建立時間*/
    createTime?: number;
}

/**自訂訂單前綴*/
export interface OrderForm {
    id: string; /**服務ID*/
    prefix: string; /**訂單前綴*/
    number: number; /**目前單號*/
}

export interface Profit {
    userId: string;
    userName: string;
    platform: string;
    /**下注次數 */
    betCount: number;
    /**下注金額 */
    bet: number;
    /**輸贏 */
    winloss: number;
    /**有效下注 */
    validBet: number;
    /**退水 */
    water: number;
    /**彩金 */
    prize: number;
    /**彩金獲利 */
    prizeprovide: number;
    /**小費 */
    tip: number;
    /**佔成 */
    payPer: number;
    /**上層佔成 */
    parentPayPer: number;
    /**上層退水 */
    parentWater: number;
}

/**
 * 遊戲平台
 */
export interface GamePlatform {
    id: string;
    key: number;
    name: string;
    tables: string[];
    timeColumn: string;
}

export interface ProfitDetil {
    /**遊戲 */
    game: number;
    /**下注次數 */
    betCount: number;
    /**下注金額 */
    bet: number;
    /**輸贏 */
    winloss: number;
    /**有效下注 */
    validBet: number;
    /**退水 */
    water: number;
    /**彩金 */
    prize: number;
    /**彩金獲利 */
    prizeprovide: number;
    /**佔成 */
    payPer: number;
    /**開始時間 */
    startTime: number;
    /**結束時間 */
    endTime: number;
}
