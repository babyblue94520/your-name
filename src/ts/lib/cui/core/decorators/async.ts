
/**
 * 非同步執行
 * @param delay
 */
export function Async(delay: number = 0) {
    return function (target, key, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            let that = this;
            let originalArgs = arguments;
            return setTimeout(function () {
                originalMethod.apply(that, originalArgs);
            }, delay);
        };
        return descriptor;
    };
}

/**
 * 延遲執行
 * @param delay
 */
export function Delay(delay: number = 0) {
    let timer;
    return function (target, key, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        let originalMethod = descriptor.value;
        descriptor.value = function () {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            let that = this;
            let originalArgs = arguments;
            timer = setTimeout(function () {
                originalMethod.apply(that, originalArgs);
                timer = undefined;
            }, delay);
        };
        return descriptor;
    };
}
