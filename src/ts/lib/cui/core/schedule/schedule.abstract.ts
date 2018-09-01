import { IScheduleTask } from './schedule.interfaces';
import { ScheduleManager } from './schedule-manager';


export abstract class AbstractScheduleTask implements IScheduleTask {
    id: string;
    handler: Function;
    interval: number;
    count: number;
    firstRun: boolean;

    public init = () => {
        ScheduleManager.add(this);
    }

    public start() {
        ScheduleManager.start(this.id);
    }

    public stop() {
        ScheduleManager.stop(this.id);
    }

    public remove() {
        ScheduleManager.remove(this.id);
    }
}
