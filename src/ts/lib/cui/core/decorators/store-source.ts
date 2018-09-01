import { StoreNode } from '../store/store-node';

export function StoreNodeSource(store: StoreNode<any>) {
    return (target, key: string) => {
        let _val;
        // property value
        let getter = function () {
            return _val;
        };
        // property setter
        let setter = function (newVal) {
        };

        store.listen(() => {
            _val = store.get();
        }, true);

        // Delete property.
        if (delete target[key]) {
            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    };
}
