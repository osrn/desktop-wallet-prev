import { Networks } from "@payvo/sdk";
import { sortBy } from "@payvo/sdk-helpers";
import { Contracts } from "@payvo/sdk-profiles";
import { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useEnvironmentContext } from "@/app/contexts/Environment";

export const useActiveProfile = (): Contracts.IProfile => {
	const history = useHistory();

	const context = useEnvironmentContext();
	const { profileId } = useParams<{ profileId: string }>();

	return useMemo(() => {
		if (!profileId) {
			throw new Error(
				`Parameter [profileId] must be available on the route where [useActiveProfile] is called. Current route is [${history.location.pathname}].`,
			);
		}

		return context.env.profiles().findById(profileId);
	}, [context.env, history.location.pathname, profileId]);
};

export const useActiveWallet = (): Contracts.IReadWriteWallet => {
	const profile = useActiveProfile();
	const { walletId } = useParams<{ walletId: string }>();

	return useMemo(() => profile.wallets().findById(walletId), [profile, walletId]);
};

export const useNetworks = (profile: Contracts.IProfile) => {
	const isProfileRestored = profile.status().isRestored();
	return useMemo<Networks.Network[]>(() => {
		const networks: Record<string, Networks.Network> = {};

		for (const wallet of profile.wallets().values()) {
			networks[wallet.networkId()] = wallet.network();
		}

		return sortBy(Object.values(networks), (network) => network.displayName());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile, isProfileRestored]);
};

export const useActiveWalletWhenNeeded = (isRequired: boolean) => {
	const profile = useActiveProfile();
	const { walletId } = useParams<{ walletId: string }>();

	return useMemo(() => {
		try {
			return profile.wallets().findById(walletId);
		} catch (error) {
			if (isRequired) {
				throw error;
			}

			return;
		}
	}, [isRequired, profile, walletId]);
};
