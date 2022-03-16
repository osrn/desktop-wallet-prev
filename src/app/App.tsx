import "focus-visible";

import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";
import { ARK } from "@payvo/sdk-ark";

import { Environment } from "@payvo/sdk-profiles";
import React, { useLayoutEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { I18nextProvider, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { middlewares, RouterView, routes } from "router";

import { SyncErrorMessage } from "./components/ProfileSyncStatusMessage";
import { ConfigurationProvider, EnvironmentProvider, LedgerProvider, useEnvironmentContext } from "./contexts";
import { useDeeplink, useNetworkStatus, useProfileSynchronizer } from "./hooks";
import { i18n as index18n } from "./i18n";
import { PluginProviders } from "./PluginProviders";
import { SentryProvider } from "./sentry/SentryProvider";
import { SentryRouterWrapper } from "./sentry/SentryRouterWrapper";
import { httpClient, toasts } from "./services";
import { bootEnvironmentWithProfileFixtures, isE2E, isUnit } from "@/utils/test-helpers";
import { setThemeSource, shouldUseDarkColors } from "@/utils/electron-utils";
import { StubStorage } from "@/tests/mocks";
import { Splash } from "@/domains/splash/pages";
import { Offline } from "@/domains/error/pages";

const RouteWrappers = ({ children }: { children: React.ReactNode }) => (
	<SentryRouterWrapper>{children}</SentryRouterWrapper>
);

const Main = () => {
	const [showSplash, setShowSplash] = useState(true);
	const { env } = useEnvironmentContext();
	const isOnline = useNetworkStatus();
	const history = useHistory();
	const { t } = useTranslation();

	useProfileSynchronizer({
		onProfileRestoreError: () => history.push("/"),
		onProfileSignOut: () => {
			toasts.dismiss();
		},
		onProfileSyncComplete: async () => {
			await toasts.dismiss();
			toasts.success(t("COMMON.PROFILE_SYNC_COMPLETED"));
		},
		onProfileSyncError: async (failedNetworkNames, retryProfileSync) => {
			await toasts.dismiss();

			toasts.warning(
				<SyncErrorMessage
					failedNetworkNames={failedNetworkNames}
					onRetry={async () => {
						await toasts.dismiss();
						retryProfileSync();
					}}
				/>,
			);
		},
		onProfileSyncStart: () => {
			toasts.warning(t("COMMON.PROFILE_SYNC_STARTED"), { autoClose: false });
		},
	});

	useDeeplink();

	useLayoutEffect(() => {
		setThemeSource("system");

		document.body.classList.remove(`theme-${shouldUseDarkColors() ? "light" : "dark"}`);
		document.body.classList.add(`theme-${shouldUseDarkColors() ? "dark" : "light"}`);
	}, []);

	const handleError = useErrorHandler();

	useLayoutEffect(() => {
		const boot = async () => {
			try {
				/* istanbul ignore next */
				if (isE2E() || isUnit()) {
					await bootEnvironmentWithProfileFixtures({ env, shouldRestoreDefaultProfile: isUnit() });

					setShowSplash(false);
					return;
				}

				/* istanbul ignore next */
				await env.verify();
				/* istanbul ignore next */
				await env.boot();
			} catch (error) {
				handleError(error);
			}

			setShowSplash(false);
		};

		boot();
	}, [env, handleError]);

	const renderContent = () => {
		if (showSplash) {
			return <Splash />;
		}

		if (!isOnline) {
			return <Offline />;
		}

		return <RouterView routes={routes} middlewares={middlewares} wrapper={RouteWrappers} />;
	};

	return (
		<main data-testid="Main">
			<ToastContainer closeOnClick={false} newestOnTop />

			{renderContent()}
		</main>
	);
};

export const initializeEnvironment = () => {
	/* istanbul ignore next */
	const storage = isE2E() || isUnit() ? new StubStorage() : "indexeddb";

	return new Environment({
		coins: {
			ARK
		},
		httpClient,
		ledgerTransportFactory: async () => LedgerTransportNodeHID.open(),
		storage,
	});
};

export const App = () => {
	/**
	 * Ensure that the Environment object will not be recreated when the state changes,
	 * as the data is stored in memory by the `DataRepository`.
	 */
	const [environment] = useState(() => initializeEnvironment());

	return (
		<I18nextProvider i18n={index18n}>
			<EnvironmentProvider env={environment}>
				<ConfigurationProvider defaultConfiguration={{ profileIsSyncingExchangeRates: true }}>
					<SentryProvider>
						<LedgerProvider transport={LedgerTransportNodeHID}>
							<PluginProviders>
									<Main />								
							</PluginProviders>
						</LedgerProvider>
					</SentryProvider>
				</ConfigurationProvider>
			</EnvironmentProvider>
		</I18nextProvider>
	);
};
