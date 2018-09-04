import { StoreNode } from '@cui/core';

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

