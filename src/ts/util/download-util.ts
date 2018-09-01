export class DownloadUtil {
    public static js(name: string, content: string) {
        DownloadUtil.download.call(null, name, content, 'application/javascript');
    }

    public static text(name: string, content: string) {
        DownloadUtil.download.call(null, name, content, 'application/text');
    }

    public static excel(name: string, content: string) {
        DownloadUtil.download.call(null, name, content, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
