/**
 * 斬斷迴圈Method
 * @param target
 * @param key
 * @param descriptor
 */
export function NotRecursionMethod(target, key, descriptor) {
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    let originalMethod = descriptor.value;
    let recursionFlag = '__recursion' + key;
    descriptor.value = function () {
        if (!this[recursionFlag]) {
            this[recursionFlag] = true;
            let result = originalMethod.apply(this, arguments);
            this[recursionFlag] = false;
            return result;
        } else {
            console.error(this.config.id, key, this[recursionFlag], '出現無窮遞迴！小心！');
        }
    };
    return descriptor;
}
