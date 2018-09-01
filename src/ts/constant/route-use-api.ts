import { AppRoute } from '../ng/router/app';
import { ApiPath } from './API';

export let routeUseApi = {};

/**
 * 權限等級
 */
routeUseApi[AppRoute.Main.Manage.Authority.join('/')] = [
    ApiPath.AuthorityQueryPage,
    ApiPath.AuthorityAdd,
    ApiPath.AuthorityModify,
    ApiPath.AuthorityRemove,
];

/**
 * 權限群組
 */
routeUseApi[AppRoute.Main.Manage.AuthorityGroup.join('/')] = [
    ApiPath.AuthorityGroupQueryPage,
    ApiPath.AuthorityGroupAdd,
    ApiPath.AuthorityGroupModify,
    ApiPath.AuthorityQueryComboboxData,
    ApiPath.AuthorityGroupPermissionQuery,
    ApiPath.AuthorityGroupPermissionModify,
];

/**
 * 使用者
 */
routeUseApi[AppRoute.Main.Manage.User.join('/')] = [
    ApiPath.UserQueryPage,
    ApiPath.UserAdd,
    ApiPath.UserModify,
    ApiPath.UserModifyPassword,
    ApiPath.UserResetPassword,
    ApiPath.AuthorityGroupQueryComboboxData
];

/**
 * 選單
 */
routeUseApi[AppRoute.Main.Manage.Route.join('/')] = [
    ApiPath.RouteQuery,
    ApiPath.RouteAdd,
    ApiPath.RouteModify,
    ApiPath.RouteRemove,
    ApiPath.RouteFolder,
];

/**
 * 請求
 */
routeUseApi[AppRoute.Main.Manage.Api.join('/')] = [
    ApiPath.ApiQuery,
    ApiPath.ApiAdd,
    ApiPath.ApiModify,
    ApiPath.ApiRemove
];

/**
 * 訪問紀錄
 */
routeUseApi[AppRoute.Main.Manage.AccessLog.join('/')] = [
    ApiPath.AccessLogQueryPage,
    ApiPath.AccessLogDelete,
];

/**
 * 訪問紀錄群組
 */
routeUseApi[AppRoute.Main.Manage.AccessLogGroup.join('/')] = [
    ApiPath.AccessLogQueryGroupPage,
    ApiPath.AccessLogQueryDetilPage,
    ApiPath.AccessLogDelete,
];
