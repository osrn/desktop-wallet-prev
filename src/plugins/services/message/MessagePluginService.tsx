import { useSignMessageModal } from "./use-sign-message-modal";
import { PluginService } from "@/plugins/core";
import { PluginServiceConfig, PluginServiceIdentifier } from "@/plugins/types";

export class MessagePluginService implements PluginService {
	config(): PluginServiceConfig {
		return {
			accessor: "message",
			id: PluginServiceIdentifier.Message,
		};
	}

	api(): Record<string, Function> {
		return {
			useSignMessageModal,
		};
	}
}
