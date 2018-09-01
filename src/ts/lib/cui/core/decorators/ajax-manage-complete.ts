import { IAjaxManagerResult } from '../ajax/ajax.interfaces';
import { AjaxUtil } from '../ajax/ajax-util';

interface State {
    count: number;
    results: IAjaxManagerResult[];
    originalMethod: Function;
}

/**
 *
 * @param target
 * @param key
 */
export function AjaxManageComplete(...args: Function[]) {
    let ajaxs = [];
    for (let i in args) {
        if (args[i] instanceof Function) {
            ajaxs.push(args[i]);
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
                results: [],
                originalMethod: originalMethod,
            };
            state.results.length = ajaxs.length;

            for (let i in ajaxs) {
                ajaxs[i].call(this, callback.bind(this, state, i));
            }
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    };
}


function callback(state: State, index: number, result: IAjaxManagerResult) {
    if (result.success) {
        state.results[index] = result;
        if (++state.count >= state.results.length) {
            state.originalMethod.apply(this, state.results);
        }
    } else {
        alert(AjaxUtil.getMessage(result));
    }
}
