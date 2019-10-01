import { CUI, Grid } from '@cui/core';
import { GridRenderUtil } from 'ts/util/grid-render-util';

export function buildOrderLogGrid(records, statusNames = {}) {
    if (!CUI.isArray(records)) {
        return;
    }
    let grid = Grid.GridBuilder.build({
        size: 50,
        rowColumns: [
            { value: 'value', name: '', align: 'left', element: true, onRender: GridRenderUtil.viewer }
            , { value: 'time', name: '時間', align: 'left', width: '1%', onRender: GridRenderUtil.date }
            , { value: 'key', name: 'Key', align: 'left', width: '1%' }
            , {
                value: 'value', name: '詳細', align: 'left', width: '100%', maxWidth: '1000px', element: true
                , onRender: (value, record, index) => {
                    if (record.key == 'status') {
                        let name = statusNames[value];
                        return name ? name + '(' + value + ')' : value;
                    } else {
                        return value;
                    }
                }
            }
        ]
        , contentColumns: [
            {
                value: 'value', name: '詳細', align: 'left', element: true, onRender: GridRenderUtil.keyJson
            }
        ]
    });
    grid.load(records);
    return grid.getElement();
}

export function buildHandleResultGrid(records) {
    if (!CUI.isArray(records)) {
        return;
    }
    let grid = Grid.GridBuilder.build({
        size: 50,
        rowColumns: [
            { value: 'value', name: '', align: 'left', element: true, onRender: GridRenderUtil.viewer }
            , { value: 'time', name: '時間', align: 'left', width: '1%', onRender: GridRenderUtil.date }
            , { value: 'key', name: 'Key', align: 'left', width: '1%' }
            , { value: 'value', name: '詳細', align: 'left', width: '100%', maxWidth: '1000px', element: true }
        ]
        , contentColumns: [
            {
                value: 'value', name: '詳細', align: 'left', element: true, onRender: GridRenderUtil.keyJson
            }
        ]
    });
    grid.load(records);
    return grid.getElement();
}
