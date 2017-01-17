cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-websocket/www/websocket.js",
        "id": "cordova-plugin-websocket.websocket",
        "pluginId": "cordova-plugin-websocket",
        "clobbers": [
            "WebSocket"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
        "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
        "pluginId": "cordova-plugin-bluetooth-serial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-websocket": "0.12.0",
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-bluetooth-serial": "0.4.5",
    "cordova-plugin-splashscreen": "3.0.0"
}
// BOTTOM OF METADATA
});