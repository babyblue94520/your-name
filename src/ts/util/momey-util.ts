export class MomeyUtil {
    public static format(value: any, n?: number): string {
        if (isNaN(value)) { return value; }
        n = isNaN(n) ? 2 : n;
        value = Number(value).toFixed(n);
        return String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}
