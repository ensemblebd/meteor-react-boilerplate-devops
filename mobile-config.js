App.info({
    id: 'com.ensemble.sampleapp',
    name: 'SampleApp',
    version: "1.0.5",

    description: 'Excellent, Tagline',
    author: 'My Company',
    email: 'support@mywebsite.com',
    website: 'https://sampleapp.mywebsite.com'
});

// Set up resources such as icons and launch screens.
App.icons({
    'iphone_2x': 'resources/ios-assets/iphone_2x.png',
    'iphone_3x': 'resources/ios-assets/iphone_3x.png',
    'android_mdpi': 'resources/android-assets/icons/mdpi.png',
    'android_hdpi': 'resources/android-assets/icons/hdpi.png',
    'android_xhdpi': 'resources/android-assets/icons/xhdpi.png',
    'android_xxhdpi': 'resources/android-assets/icons/xxhdpi.png',
    'android_xxxhdpi': 'resources/android-assets/icons/xxxhdpi.png'
    // More screen sizes and platforms...
    /*
        app_store (1024x1024) // Apple App Store
        iphone_2x (120x120) // iPhone 5, SE, 6, 6s, 7, 8
        iphone_3x (180x180) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
        ipad_2x (152x152) // iPad, iPad mini
        ipad_pro (167x167) // iPad Pro
        ios_settings_2x (58x58) // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
        ios_settings_3x (87x87) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
        ios_spotlight_2x (80x80) // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
        ios_spotlight_3x (120x120) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
        ios_notification_2x (40x40) // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
        ios_notification_3x (60x60 // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
        ipad (76x76) // Legacy
        ios_settings (29x29) // Legacy
        ios_spotlight (40x40) // Legacy
        ios_notification (20x20) // Legacy
        iphone_legacy (57x57) // Legacy
        iphone_legacy_2x (114x114) // Legacy
        ipad_spotlight_legacy (50x50) // Legacy
        ipad_spotlight_legacy_2x (100x100) // Legacy
        ipad_app_legacy (72x72) // Legacy
        ipad_app_legacy_2x (144x144) // Legacy
        android_mdpi (48x48)
        android_hdpi (72x72)
        android_xhdpi (96x96)
        android_xxhdpi (144x144)
        android_xxxhdpi (192x192)
    */
});
App.launchScreens({
    'android_mdpi_portrait': 'resources/android-assets/launch-screens/mdpi_portrait.png',
    'android_mdpi_landscape': 'resources/android-assets/launch-screens/mdpi_landscape.png',
    'android_hdpi_portrait': 'resources/android-assets/launch-screens/hdpi_portrait.png',
    'android_hdpi_landscape': 'resources/android-assets/launch-screens/hdpi_landscape.png',
    'android_xhdpi_portrait': 'resources/android-assets/launch-screens/xhdpi_portrait.png',
    'android_xhdpi_landscape': 'resources/android-assets/launch-screens/xhdpi_landscape.png',
    'android_xxhdpi_portrait': 'resources/android-assets/launch-screens/xxhdpi_portrait.png',
    'android_xxhdpi_landscape': 'resources/android-assets/launch-screens/xxhdpi_landscape.png',
    'android_xxxhdpi_portrait': 'resources/android-assets/launch-screens/xxxhdpi_portrait.png',
    'android_xxxhdpi_landscape': 'resources/android-assets/launch-screens/xxxhdpi_landscape.png'
    /*
    * In addition, Cordova on iOS supports using launch story board images, which is now Apple’s recommended approach for providing launch screens.
    * This has the benefit of not requiring you to provide an image for every possible device screen size. Just remove all the iOS App.launchScreens directives from your mobile-config.js
    * and use App.appendToConfig to add the paths to your universal images.
    * */
    // More screen sizes and platforms...
    /*
        iphone5 (640x1136) // iPhone 5, SE
        iphone6 (750x1334) // iPhone 6, 6s, 7, 8
        iphone6p_portrait (1242x2208) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
        iphone6p_landscape (2208x1242) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
        iphoneX_portrait (1125x2436) // iPhone X
        iphoneX_landscape (2436x1125) // iPhone X
        ipad_portrait_2x (1536x2048) // iPad, iPad mini
        ipad_landscape_2x (2048x1536) // iPad, iPad mini
        ipad_portrait_pro_10_5 (1668x2224) // iPad Pro 10.5"
        ipad_landscape_pro_10_5 (2224x1668) // iPad Pro 10.5"
        ipad_portrait_pro_12_9 (2048x2732) // iPad Pro 12.9"
        ipad_landscape_pro_12_9 (2732x2048) // iPad Pro 12.9"
        iphone_2x (640x960) // Legacy
        ipad_portrait (768x1024) // Legacy
        ipad_landscape (1024x768) // Legacy
        android_mdpi_portrait (320x480)
        android_mdpi_landscape (480x320)
        android_hdpi_portrait (480x800)
        android_hdpi_landscape (800x480)
        android_xhdpi_portrait (720x1280)
        android_xhdpi_landscape (1280x720)
        android_xxhdpi_portrait (960x1600)
        android_xxhdpi_landscape (1600x960)
        android_xxxhdpi_portrait (1280x1920)
        android_xxxhdpi_landscape (1920x1280)
     */
});
// Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xff222a3a'); // first byte is alpha channel. FF == 1.0/255 alpha (full opacity)
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');
App.setPreference('WebAppStartupTimeout', 20000); // default is 20 seconds

// Pass preferences for a particular PhoneGap/Cordova plugin.
/*App.configurePlugin('com.phonegap.plugins.facebookconnect', {
    APP_ID: '1234567890',
    API_KEY: 'supersecretapikey'
});*/

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the generated config.xml. 'Universal Links' is shown as an example here.
App.appendToConfig(`
  <splash src="../../../resources/ios-assets/Default@2x~universal~anyany.png" />
  <splash src="../../../resources/ios-assets/Default@3x~universal~anyany.png" />
  <universal-links>
    <host name="localhost:3000" />
    <host name="sampleapp.mywebsite.com" />
  </universal-links>
`);

/* IOS image size table, for Cordova Storyboard images:   https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/#launch-storyboard-images
2x*	universal	any	any	2732x2732	Default@2x~universal~anyany.png
2x	universal	com	any	1278x2732	Default@2x~universal~comany.png
2x	universal	com	com	1334x750	Default@2x~universal~comcom.png
3x*	universal	any	any	2208x2208	Default@3x~universal~anyany.png
3x	universal	any	com	2208x1242	Default@3x~universal~anycom.png
3x	universal	com	any	1242x2208	Default@3x~universal~comany.png
* */

// allow data-loading in iframes (not currently utilzied, here for posterity)
App.accessRule('data:*', { type: 'navigation' });
// ios access rule for Application Transport Security
App.accessRule('https://sampleapp.mywebsite.com', {
    'minimum-tls-version': 'TLSv1.0',
    'requires-forward-secrecy': false,
});

