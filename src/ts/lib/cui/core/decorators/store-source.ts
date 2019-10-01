import { StoreNode } from '../store/store-node';

export function StoreNodeSource(store: StoreNode<any>, defaultValue?: any) {
    return function (target, key: string) {
        let _val = defaultValue;
        // property value
        let getter = function () {
            return _val;
        };

        store.listen(() => {
            _val = store.get();
            if (!_val) {
                _val = defaultValue;
            }
        }, true);

        // Delete property.
        if (delete target[key]) {
            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                enumerable: true,
                configurable: true
            });
        }
    };
}
