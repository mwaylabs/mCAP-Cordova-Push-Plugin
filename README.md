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
// set the endpoint of the server
        mCAP.application.set('baseUrl', 'http://SERVER.COM');
// create a push notification
        pushNotification = new mCAP.PushNotification({
            // the uuid of the push service
            pushServiceId: '<PUSH_SERVICE_UIID>',
            // the api key from google
            senderId: '<GOOGLE_ID>'
        });

        // register the device
        pushNotification.register();

        // Event overview
        pushNotification.on('register', function () {
            console.log('register', arguments);
        });

        pushNotification.on('error', function () {
            console.log('error', arguments);
        });

        pushNotification.on('token', function () {
            console.log('token', arguments);
        });

        pushNotification.on('registerdevice', function () {
            console.log('registerdevice', arguments);
        });

        pushNotification.on('registerdeviceerror', function () {
            console.log('registerdeviceerror', arguments);
        });

        pushNotification.on('message', function () {
            console.log('message', arguments);
        });

        pushNotification.on('badge', function () {
            console.log('badge', arguments);
        });

        pushNotification.on('unknown', function () {
            console.log('unknown', arguments);
        });

    }, false);
```

# API
[Push Notification Object definition](https://github.com/mwaylabs/mcapjs-client/blob/master/src/push/push_notification.js)

## Events
- register
    - Called when the app was registered at the push server (mCAP, Apple Push Notification or Google Cloud Notification)
- error
    - Called on different errors
- token
    - Called if the app receives a token
- registerdevice
    - Called if the app was successfully registered at the mCAP
- registerdeviceerror
    - Called if the app was unsuccessfully registered at the mCAP
- message
    - Called when a message (Push Notification) received
- badge
    - Called on a badge update
- unknown
    - Called if there was an unknown state
