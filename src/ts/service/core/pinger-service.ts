import { ApiPath } from '../../constant/API';
import { BasicService } from './basic-service';
import { Global } from '../../globle';



interface Pinger {
	sessionTimeout: number;
	sessionLastAccessTime: number;
	pingerLastAccessTime: number;
	pingerLastCheckTime: number;
	countdownStartTimeSecond: number;
	countdownCheckIntervalSecond: number;
}

/**
 * 檢查用戶閒置時間
 */
export class PingerService {
	private static countdownTimer;
	private static checkTimer;
	private static isCountDown = false;
	// 倒數時間
	private static countdown = 0;
	// 低於這個時間就開始倒數
	private static countdownStartTime = 60;
	private static countdownCheckInterval = 5000;
	// 恢復
	private static button: HTMLButtonElement;

	constructor() {
	}

	private static createButtin() {
		if (!PingerService.button) {
			PingerService.button = document.createElement('button');
			PingerService.button.className = 'cui-button';
			PingerService.button.innerHTML = '繼續';
			PingerService.button.addEventListener('click', PingerService.restore);
		}
	}

	/**
	 *
	 */
	public static start() {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGivePingerInit,
			callback: (result) => {
				if (result.success) {
					let data = result as Pinger;
					PingerService.countdownStartTime = data.countdownStartTimeSecond;
					PingerService.countdownCheckInterval = data.countdownCheckIntervalSecond * 1000;
					PingerService.countdown = 0;
					PingerService.count(data);
				}
			}
		});
	}

	/**
	 * 檢查
	 */
	public static check() {
		Global.ajaxManager.request({
			url: ApiPath.EmperorGivePingerCheck,
			callback: (result) => {
				if (result.success) {
					PingerService.count(result);
				}
			}
		});
	}

	/**
	 * 停止
	 */
	public static stop() {
		PingerService.isCountDown = false;
		PingerService.closeMessage();
		PingerService.clearAllTimer();
	}

	/**
	 * 清除所有timer
	 */
	public static clearAllTimer() {
		clearTimeout(PingerService.checkTimer);
		clearTimeout(PingerService.countdownTimer);
	}

	/**
	 * 計算
	 */
	public static count(data: Pinger) {
		if (!data.sessionTimeout) {
			return;
		}
		let timeout = data.sessionTimeout;
		let idleTime = Math.floor(Math.abs(data.sessionLastAccessTime - data.pingerLastAccessTime) / 1000);

		let nextCheckTime = (timeout - idleTime);
		if (nextCheckTime <= 0) {
			PingerService.closeMessage();
			PingerService.timeUp();
		} else if (nextCheckTime <= PingerService.countdownStartTime) {
			// 倒數時的Check
			PingerService.checkTimer = setTimeout(PingerService.check, PingerService.countdownCheckInterval);
			if (PingerService.isCountDown) {
				PingerService.countdown = nextCheckTime;
				return;
			}
			// 進入倒數
			PingerService.countdown = PingerService.countdownStartTime;
			PingerService.isCountDown = true;
			PingerService.closeMessage();
			PingerService.showMessage();
			PingerService.doCountDown();

		} else {
			// 執行下一次Check
			PingerService.isCountDown = false;
			let temp = Math.floor(nextCheckTime / 2);
			nextCheckTime = temp > PingerService.countdownStartTime ? temp : (nextCheckTime - PingerService.countdownStartTime);
			PingerService.checkTimer = setTimeout(PingerService.check, (nextCheckTime || 1) * 1000);
		}
	}

	/**
	 * 顯示提醒
	 */
	public static showMessage() {
		Global.loader.openNotDelay('倒數' + (PingerService.countdown--) + '登出', 99999);
		PingerService.createButtin();
		Global.loader.getElement().querySelector('.cui-loader-block').appendChild(PingerService.button);
	}

	/**
	 * 關閉提醒
	 */
	public static closeMessage() {
		Global.loader.close();
		if (PingerService.button) {
			PingerService.button.remove();
		}
	}

	/**
	 * 倒數
	 */
	public static doCountDown() {
		if (PingerService.countdown <= 0) {
			PingerService.closeMessage();
			PingerService.timeUp();
			return;
		}

		Global.loader.openNotDelay('倒數' + (PingerService.countdown--) + '登出', 99999);
		Global.loader.close();
		clearTimeout(PingerService.countdownTimer);
		PingerService.countdownTimer = setTimeout(PingerService.doCountDown, 1000);
	}

	/**
	 * 時間到
	 */
	public static timeUp() {
		PingerService.stop();
		BasicService.logout(() => {
			BasicService.init();
			alert('系統閒置太長，已登出!');
		});
	}

	/**
	 * 恢復按鈕動作
	 */
	public static restore() {
		PingerService.stop();
		PingerService.start();
	}
}
