import fs from "fs";
import electron from "electron";

import { PluginService } from "@/plugins/core";
import { PluginServiceConfig, PluginServiceIdentifier } from "@/plugins/types";

export class FileSystemPluginService implements PluginService {
	config(): PluginServiceConfig {
		return {
			accessor: "filesystem",
			id: PluginServiceIdentifier.FileSystem,
		};
	}

	api(): Record<string, Function> {
		return {
			askUserToOpenFile: this.askUserToOpenFile.bind(undefined),
			askUserToSaveFile: this.askUserToSaveFile.bind(undefined),
		};
	}

	private async askUserToSaveFile(content: string, suggestedFileName?: string): Promise<boolean> {
		const { canceled, filePath } = await electron.remote.dialog.showSaveDialog({ defaultPath: suggestedFileName });

		if (canceled || !filePath) {
			return false;
		}

		fs.writeFileSync(filePath, content, "utf-8");
		return true;
	}

	private async askUserToOpenFile() {
		const { filePaths } = await electron.remote.dialog.showOpenDialog({ properties: ["openFile"] });

		/* istanbul ignore next */
		if (!filePaths?.length) {
			return;
		}

		return fs.readFileSync(filePaths[0], "utf-8");
	}
}
