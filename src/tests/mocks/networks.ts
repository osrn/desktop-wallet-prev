import { Coins, Networks } from "@payvo/sdk";
import { ARK } from "@payvo/sdk-ark";

const createNetwork = (coin: Coins.CoinBundle, network: string) =>
	new Networks.Network(coin.manifest, coin.manifest.networks[network]);

export const availableNetworksMock: Networks.Network[] = [
	createNetwork(ARK, "sxp.mainnet"),
	createNetwork(ARK, "tsxp.testnet"),
];
