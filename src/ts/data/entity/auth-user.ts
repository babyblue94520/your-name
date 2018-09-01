/**
 * 登錄後使用者物件
 */
export interface AuthUser {
    /**帳號 */
    id: string;
    /**密碼 */
    password: string;
    /**名稱 */
    name: string;
    /**平台 */
    unit: string;
    /**登錄錯誤次數 */
    loginErrorCount: number;
    /**凍結 */
    locked: boolean;
    /**啟用 */
    enabled: boolean;
    /**權限等及 */
    level: number;
    /** 權限群組*/
    authId: number;
    /**選單 */
    routes: AuthRoute[];
    /**訪問權限 */
    apis: string[];
}

/**
 * 登錄後使用者選單物件
 */
export interface AuthRoute {
    /** test */
    id: number;
    className: string;
    name: string;
    order: number;
    parentId: number;
    path: string;
    type: number;
}

