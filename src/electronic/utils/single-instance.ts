import { app, BrowserWindow } from "electron";

const gotTheLock = app.requestSingleInstanceLock();

export function handleSingleInstance({
	mainWindow,
	broadcastURL,
}: {
	mainWindow?: BrowserWindow;
	broadcastURL: (url?: string) => void;
}) {
	if (!gotTheLock) {
		app.quit();
		return;
	}

	app.on("second-instance", (_, argv) => {
		// Someone tried to run a second instance, we should focus our window.
		// argv: An array of the second instance’s (command line / deep linked) arguments
		for (const argument of argv) {
			if (argument.startsWith("payvo:")) {
				broadcastURL(argument);
				break;
			}
		}

		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
		}
	});
}
