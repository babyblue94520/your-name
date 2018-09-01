import { IScheduleTask } from './schedule.interfaces';
/**
 * 負責管理setTimeout的服務
 */
export class ScheduleManager {
  private static taskTimers = {};
  private static tasks = {};

  /**
   * 新增一個定時任務
   * 添加後，開始執行任務
   */
  public static add = (task: IScheduleTask): IScheduleTask => {
    if (ScheduleManager.tasks[task.id]) {
      console.error(task.id + ' 任務已存在');
      return;
    }
    ScheduleManager.tasks[task.id] = task;
    task['proxy'] = ScheduleManager.timeoutHandler.bind(null, task);
    if (task.firstRun) {
      task['proxy']();
    }
    ScheduleManager.start(task.id);
    return task;
  }

  /**
   * 移除定時任務
   */
  public static remove = (id: string) => {
    if (!ScheduleManager.tasks[id]) {
      return;
    }
    ScheduleManager.stop(id);
    delete ScheduleManager.tasks[id];
  }

  /**
   * 開始定時任務
   */
  public static start = (id: string) => {
    let task = ScheduleManager.tasks[id];
    if (!ScheduleManager.tasks[id]) {
      return;
    }
    ScheduleManager.stop(id);
    ScheduleManager.taskTimers[task.id] = setTimeout(task['proxy'], task.interval);
  }

  /**
   * 停止定時任務
   */
  public static stop = (id: string) => {
    if (!ScheduleManager.tasks[id]) {
      return;
    }
    clearTimeout(ScheduleManager.taskTimers[id]);
    delete ScheduleManager.taskTimers[id];
  }

  /**
   * 移除全部任務
   */
  public static removeAll = () => {
    for (let id in ScheduleManager.tasks) {
      ScheduleManager.remove(id);
    }
  }

  /**
   * 開始所有任務
   */
  public static startAll = () => {
    for (let id in ScheduleManager.tasks) {
      ScheduleManager.start(id);
    }
  }

  /**
   * 停止所有任務
   */
  public static stopAll = () => {
    for (let id in ScheduleManager.tasks) {
      ScheduleManager.stop(id);
    }
  }

  /**
   * 主要的任務執行
   * @param task
   */
  private static timeoutHandler(task: IScheduleTask) {
    try {
      task.handler();
      task['totalCount'] = (task['totalCount'] || 0) + 1;
      if (task.count === 0 || task['totalCount'] < task.count) {
        ScheduleManager.taskTimers[task.id] = setTimeout(task['proxy'], task.interval);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
