import { AppRoute } from 'ts/ng/router/app';
import { AuthRoute } from 'ts/data/entity/entity';


export const MenuRoutes: AuthRoute[] = [
    {
        id: 1,
        className: 'flaticon-home',
        name: '首頁',
        sort: 1,
        parentId: 0,
        path: AppRoute.Index,
        type: 1
    },
    {
        id: 2,
        className: 'flaticon-factory',
        name: '公司',
        sort: 2,
        parentId: 0,
        path: [],
        type: 0
    },
    {
        id: 4,
        className: 'flaticon-mark-star',
        name: '名字運勢',
        sort: 1,
        parentId: 2,
        path: AppRoute.Company.Name,
        type: 1
    },
    {
        id: 5,
        className: 'flaticon-search',
        name: '找名字',
        sort: 2,
        parentId: 2,
        path: AppRoute.Company.Find,
        type: 1
    },
    {
        id: 6,
        className: 'flaticon-file',
        name: '筆劃運勢說明',
        sort: 3,
        parentId: 2,
        path: AppRoute.Company.Description,
        type: 1
    },
    {
        id: 7,
        className: 'flaticon-what',
        name: '好名字規則',
        sort: 4,
        parentId: 2,
        path: AppRoute.Company.Rule,
        type: 1
    },
    {
        id: 3,
        className: 'flaticon-user',
        name: '個人(未開發)',
        sort: 3,
        parentId: 0,
        path: [],
        type: 0
    },
    {
        id: 8,
        className: 'flaticon-user',
        name: '字典維護',
        sort: 4,
        parentId: 0,
        path: AppRoute.Word.Word,
        type: 1
    }
];
