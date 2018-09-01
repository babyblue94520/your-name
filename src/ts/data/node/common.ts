import { StoreNode } from '@cui/core';
import { AuthUser } from '../entity/auth-user';
import { environment } from '@environment';

// 右側選單寬度
export const MainMenuWidthNode = new StoreNode<number>({
    id: 'MainMenuWidth',
    cache: true,
    value: 0
});
// 表頭高度
export const MainHeaderHeightNode = new StoreNode<number>({
    id: 'MainHeaderWidth',
    cache: true,
    value: 0
});
// 表尾高度
export const MainFooterHeightNode = new StoreNode<number>({
    id: 'MainFooter',
    cache: true,
    value: 0
});

/**
 * 登入後使用者資料
 */
export const AuthUserNode = new StoreNode<AuthUser>({
    id: 'AuthUser',
    cache: true,
    timeout: true
});

/**
 * 特徵碼
 */
export const FeatureNode = new StoreNode<string>({
    id: 'Feature'
});

/**
 * 語系
 */
export const LangNode = new StoreNode<string>({
    id: 'Lang',
    cache: true,
    value: environment.lang,
});
