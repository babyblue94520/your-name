
import { MainRoute, MainRouteName } from './main';
import { BootRouteName } from './boot';
import { ManageRouteName } from './manage';
import { ToolRouteName } from './tool';
import { ABRouteName } from 'ts/ng/router/ab';
import { I88RouteName } from 'ts/ng/router/i88';
import { C01RouteName } from 'ts/ng/router/c01';
import { C02RouteName } from 'ts/ng/router/c02';


export enum AppRouteName {
    Default = '',
    /**
     * 主頁
     */
    Index = 'index',
    Company = 'company',
    /**
     * 頁面不存在
     */
    NotFound = 'not-found',
}
export class AppRoute {
    Index: string;
    Company: string[];

}

/**
 * 路由絕對路徑工具
 */
export class AppRouteUtil {
    /**
     *  擴展路由路徑
     * @param path
     * @param name
     */
    public static extend(path, name): any {
        const array = path;
        const newRoutePath = {};
        for (const i in name) {
            newRoutePath[i] = [].slice.call(array);
            if (name[i]) {
                newRoutePath[i].push(name[i]);
            }
        }
        return newRoutePath;
    }
}
