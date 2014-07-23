# mCAP Cordova Plugin Push

This plugin is a wrapper for the PushPlugin (https://github.com/phonegap-build/PushPlugin) and allows your application to register on push services against an mCAP.
This plugin allows your application to receive push notifications on Android, iOS and WP8 devices.
* Android uses Google Cloud Messaging.
* iOS uses Apple APNS Notifications.
* WP8 uses Microsoft MPNS Notifications.


# Installation

```
cordova plugins add https://github.com/mwaylabs/mcap-cordova-plugin-push.git
```

# TL;DR

```
cordova create Baz
cd Baz
cordova platform add android
cordova plugins add https://github.com/mwaylabs/mcap-cordova-plugin-push.git
```

copy and paste the example [index.html](https://github.com/mwaylabs/mCAP-Cordova-Push-Plugin/blob/master/Example/index.html) remember to set the correct ids and server.

```
cordova run android
```

# Usage

```
// init on deviceready
document.addEventListener('deviceready', function () {

        // set the mCAP endpoint
        mCAP.application.set('baseUrl', 'http://yourserver.com:8443/');
        // configure the push service (UUID of the push service on the mCAP)
        mCAP.push.set('uuid', '074C9386-4636-4135-B062-40235EEACB7F');
        // register the plugin
        mCAPCordovaPushPlugin.onDeviceReady({
            // configure the senderID (Google Cloud Messaging)
            senderId: "234234234235",
            // register callback
            register: function () {
                log('register', arguments);
            },
            // error callback
            error: function () {
                log('error', arguments);
            },
            // token reveived callback
            token: function () {
                log('token', arguments);
            },
            // device registered success callback
            registerdevice: function () {
                log('registerdevice', arguments);
            },
            // device registered error callback
            registerdeviceerror: function () {
                log('registerdeviceerror', arguments);
            },
            // push message received callback
            message: function () {
                log('message', arguments);
            },
            // unknown state
            unknown: function () {
                log('unknown', arguments);
            }
        });
    }, false);
```



