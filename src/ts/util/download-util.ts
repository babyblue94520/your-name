export class DownloadUtil {
    public static js(name: string, content: string) {
        DownloadUtil.download.call(null, name, content, 'application/javascript');
    }

    public static text(name: string, content: string) {
        DownloadUtil.download.call(null, name, content, 'application/text');
    }

    public static excel(name: string, content: string) {
        let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>' + content + '</body></html>';
        DownloadUtil.download.call(null, name, html, 'application/vnd.ms-excel');
        // DownloadUtil.download.call(null, name, content, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    private static download(name: string, content: string, fileType: string) {
        try {
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([content], { type: fileType }));
            a.download = name;
            a.click();
            a = null;
        } catch (e) {
            alert(e);
        }
    }
}
