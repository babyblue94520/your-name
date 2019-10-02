export class SortUtil {
    public static sort(sorts: string[], array: any[]) {
        if (array && array.length > 0 && sorts && sorts.length > 0) {
            array.sort((a, b) => {
                return sortsCompare(sorts, 0, a, b);
            });
        }
        function sortsCompare(sorts: string[], i: number, a, b) {
            if (sorts[i]) {
                let ss = sorts[i].split(',');
                let v = ss[0];
                let av = a[v], bv = b[v];
                let c = ss.length <= 1 || 'asc' == ss[1].toLowerCase() ? 1 : -1;
                let r;
                if (isNaN(av) && isNaN(bv)) {
                    r = av.localeCompare(bv);
                } else {
                    r = av > bv ? 1 : av == bv ? 0 : -1;
                }
                if (r == 0) {
                    r = sortsCompare(sorts, i + 1, a, b);
                }
                return r * c;
            } else {
                return 0;
            }
        }
        return array;
    }
}