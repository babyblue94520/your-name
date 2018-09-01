
/**
 * 開新視窗資料物件
 */
export interface WindowData {
    url: string;
    id: string;
}

/**
 * 開新視窗設定配置
 */
export interface WindowConfig {
    // 單位是 pixels。
    width?: string;
    height?: string;
    // 指定工具列是否顯示，預設是顯示，如果要設為不顯示，寫法是 toolbar=no。
    toolbar?: string;
    // 指定 scroll bars 是否顯示，要顯示寫法是 scrollbars=yes，不顯示寫法是 scrollbars=no。
    scrollbars?: string;
    // 訪客是否可以自己調整視窗大小，預設是可以，如果要設為不能調整，寫法是 resizable=no。
    resizable?: string;
    // 是否顯示網址列，預設是顯示，如果不要顯示，寫法是 location=no。
    location?: string;
    // 是否顯示目錄欄位，預設是會顯示，如果不要顯示，寫法是 menubar=no。
    menubar?: string;
    // 是否顯示狀態列，預設是顯示，如果不要顯示，寫法是 status=no。
    status?: string;
    // 距離左邊的距離，單位是 pixels。
    left?: string;
    top?: string;
}
