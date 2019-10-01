import { ComboboxData, Combobox } from '../common';

interface State {
    count: number;
    comboboxDatas: ComboboxData<Combobox>[];
    originalMethod: Function;
}

/**
 *
 * @param target
 * @param key
 */
export function AjaxComplete(...args: Function[]) {
    let comboboxAjaxs = [];
    for (let i in args) {
        if (args[i] instanceof Function) {
            comboboxAjaxs.push(args[i]);
        }
    }
    return function (target, key, descriptor) {

        // save a reference to the original method this way we keep the values currently in the
        // descriptor and don't overwrite what another decorator might have done to the descriptor.
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;

        // editing the descriptor/value parameter
        descriptor.value = function () {
            let state: State = {
                count: 0,
                comboboxDatas: [],
                originalMethod: originalMethod,
            };
            state.comboboxDatas.length = comboboxAjaxs.length;

            for (let i in comboboxAjaxs) {
                comboboxAjaxs[i].call(this, callback.bind(this, state, i));
            }
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    };
}


function callback(state: State, index: number, data: ComboboxData<any>) {
    state.comboboxDatas[index] = data;
    if (++state.count >= state.comboboxDatas.length) {
        state.originalMethod.apply(this, state.comboboxDatas);
    }
}
