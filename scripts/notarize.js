/* eslint-disable no-return-await */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
	// We intentionally skip notarisation.
	if (process.env.SKIP_NOTARIZE) {
		return;
	}

	const { electronPlatformName, appOutDir } = context;

	// We are not on macOS so we skip notarisation.
	if (electronPlatformName !== "darwin") {
		return;
	}

	// We are on a fork without the required credentials.
	if (process.env.GITHUB_HEAD_REF || process.env.GITHUB_BASE_REF) {
		return;
	}

	const appName = context.packager.appInfo.productFilename;

	return await notarize({
		appBundleId: "io.payvo.wallet",
		appPath: `${appOutDir}/${appName}.app`,
		appleApiKey: process.env.APPLE_API_KEY_ID,
		appleApiIssuer: process.env.APPLE_API_KEY_ISSUER_ID,
	});
};
