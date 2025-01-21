process.env.DEBUG = 'electron-notarize*'

const {notarize} = require("@electron/notarize");

exports.default = async function notarizing(context) {
    const appName = context.packager.appInfo.productFilename;
    const {electronPlatformName, appOutDir} = context;
    console.log(`  • Notarization Start`);
    // We skip notarization if the process is not running on MacOS and
    // if the enviroment variable SKIP_NOTARIZE is set to `true`
    // This is useful for local testing where notarization is useless
    if (
        electronPlatformName !== "darwin" ||
        process.env.SKIP_NOTARIZE === "true"
    ) {
        console.log(`  • Skipping notarization`);
        return;
    }

    // THIS MUST BE THE SAME AS THE `appId` property
    // in your electron builder configuration
    const appId = "FocusAny";

    let appPath = `${appOutDir}/${appName}.app`;
    let {APPLE_ID, APPLE_ID_PASSWORD, APPLE_TEAM_ID} = process.env;
    const notarizeOption = {
        tool: "notarytool",
        appBundleId: appId,
        appPath,
        appleId: APPLE_ID,
        appleIdPassword: APPLE_ID_PASSWORD,
        teamId: APPLE_TEAM_ID,
    }
    console.log(`  • Notarizing`, `appPath:${appPath} notarizeOption:${JSON.stringify(notarizeOption)}`);
    return await notarize(notarizeOption);
};
