
/**
 * try catch ajax method，發生例外時，將錯誤結果傳給callback
 * @param callbackIndex callback方法的位置
 */
export function AjaxTryCatch(callbackIndex?: number) {
    return function (target, key, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            try {
                originalMethod.apply(this, arguments);
            } catch (e) {
                console.error(e);
                if (callbackIndex != undefined) {
                    let fn = arguments[callbackIndex];
                    if (fn instanceof Function) {
                        fn({
                            success: false,
                            message: (<Error>e).message
                        });
                    } else {
                        console.error(fn, 'callback is\'t function');
                    }
                }
            }
        };
        return descriptor;
    };
}
