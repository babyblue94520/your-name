export interface IScheduleTask {
    /**
     * 任務ID
     */
    id: string;
    /**
     * 執行方法
     */
    handler: Function;
    /**
     * 間隔時間
     */
    interval: number;
    /**
     * 執行次數
     * 0 = 無限次
     */
    count: number;
    /**
     * 是否立即執行
     */
    firstRun: boolean;
}
