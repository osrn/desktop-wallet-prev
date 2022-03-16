import { Contracts, Repositories } from "@payvo/sdk-profiles";

import { IPluginController, PluginService } from "@/plugins/core";
import { PluginHooks } from "@/plugins/core/internals";
import { PluginServiceConfig, PluginServiceIdentifier } from "@/plugins/types";

export class StorePluginService implements PluginService {
	#profile: Contracts.IProfile | undefined;
	#stores = new Map<string, Contracts.IDataRepository>();

	config(): PluginServiceConfig {
		return {
			accessor: "store",
			id: PluginServiceIdentifier.Store,
		};
	}

	boot(context: { hooks: PluginHooks }): void {
		context.hooks.onProfileChange((profile) => (this.#profile = profile));
	}

	api(plugin: IPluginController): Record<string, Function> {
		const id = plugin.config().id();
		if (!this.#stores.has(id)) {
			this.create(id);
		}

		const store = this.#stores.get(id);

		return {
			data: () => store,
			// @ts-ignore
			persist: this.persist.bind(this, id, store),
		};
	}

	private create(pluginId: string) {
		const data = new Repositories.DataRepository();
		const stored = this.restore(pluginId);

		if (stored && Object.keys(stored).length > 0) {
			data.fill(stored);
		}

		this.#stores.set(pluginId, data);
	}

	private restore(pluginId: string) {
		return this.#profile?.data().get(`plugins.${pluginId}.store`, {});
	}

	private persist(pluginId: string, data: Contracts.IDataRepository) {
		return this.#profile?.data().set(`plugins.${pluginId}.store`, data.all());
	}
}
