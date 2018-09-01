
import { Global } from '../globle';
import { ApiPath, ApiClassName } from '../constant/API';
export class AuthorityUtil {
    public static readonly adminLevel = 1;
    public static readonly styleId = 'authority-style';

    /**
     * 更新 Authority css style
     */
    public static updatePermissionStyle() {
        let content = '';
        let path;
        for (let id in ApiPath) {
            path = ApiPath[id];
            if (!Global.authUser || Global.authUser.apis.indexOf(path) == -1) {
                content += '.' + ApiClassName[id] + '{display:none}';
            }
        }
        let style: HTMLStyleElement = document.head.querySelector('#' + AuthorityUtil.styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = AuthorityUtil.styleId;
            document.head.appendChild(style);
        }
        style.innerText = content;
    }

    /**
     * 檢查是否有權限 依API路徑
     * @param path
     */
    public static isPermission(path: ApiPath): boolean {
        if (!Global.authUser) {
            return false;
        }
        return Global.authUser.apis.indexOf(path) == -1 ? false : true;
    }

    /**
     * 檢查是否有權限 依權限等級
     * @param authorityLevel
     */
    public static isPermissionByLevel(authorityLevel: number) {
        if (!Global.authUser) {
            return false;
        }
        if (Global.authUser.level == AuthorityUtil.adminLevel) {
            return true;
        }
        return Global.authUser.level < authorityLevel;
    }
}
