# [DEPRECATED]
please refrain from using this plugin and use https://github.com/phonegap-build/PushPlugin instead

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

## PushNotification Attributes
- pushServiceId
  - UUID of the mCAP Push Service (String)
- providerType
  - The push provider type
  - 'GCM': Google Cloud Messaging (String, mCAP.GCM)
  - 'APNS': Apple Push Notification Service (String, mCAP.APNS)
  - 'MCAP': mCAP Push Notification Service (String, mCAP.MCAP)
- user
  - Username of the device/app (String)
- vendor
  - Vendor name of the device (String)
- name
  - The device model name (String)
- osVersion
  - The device operating system version (String)
- language
  - Language Code (String)
- country
  - Country Code (String)
- tags
  - List of registered Tags (String Array)
- badge
  - The current Badge counter (Number)
- appVersion
  - The application Version (String)
- attributes
  - List of extra attributes (Object)

## PushNotification Methods
- get(String:AttributeName)
    - returns the value to the given AttributeName
- set(String:AttributeName, *:Value)
    - sets the value to the given AttributeName
- getConfiguration()
    - Returns the configuration 
- addAttribute(String:AttributeName, *:Value)
    -  Add an extra attribute
- removeAttribute(String:AttributeName)
    - Remove an extra attribute
- addAttributes(Object:AttributeObject)
    - Add extra attributes
    - addAttributes({title:'My App', name:'Relution'})
- removeAttributes(StringArray:AttributeNames)
    - Remove extra attributes
    - removeAttributes(['title', 'name'])
- removeAttributes(String:attributeName, String:AttributeName, ...)
    - Remove extra attributes
    - removeAttributes('title', 'name')
- putAttributeValue(String:AttributeName, *:AttributeValue)
    - Add an extra attribute 
- addTag(String:TagName)
    - Add a tag
- removeTag(String:TagName)
    - Remove a tag
- addTags(StringArray:AttributeTags)
    - Add multiple tags
    - addTags('sport', 'politics')
- removeTags(StringArray:AttributeNames)
    - Remove tags
    - removeTags(['sports', 'politics'])
- subscribeTag(String:TagName)
    - Subscribe to a tag
    - Same as addTag
- subscribeTags(StringArray:AttributeTags)
    - Same as addTags
- setCountry(String:CountryCode)
    - Set the country
    - set('en')
    - setCountry('en')
- setCurrentBadge(Number:BadgeNumber)
    - setCurrentBadge('badge', 3);
    - set('badge', 3);
- setToken(String:Token)
    - setToken('3asdf2233');
    - set('token', '3asdf2233');
- setLanguage(String:Language)
    - setLanguage('DE');
    - set('language', 'DE');
- setModel(String:Modelname)
    - setModel('iPhone 4s')
    - set('name', 'iPhone 4s')
- setUser(String:UserName)
    - setUser('Max Mustermann')
    - set('user', 'Max Mustermann')
- unsubscribeTag(String:TagName)
    - unsubscribe from a tag
- unregisterDevice()
    - Remove the device from the mcap push list
- registerDevice()
    - Add the device to the mcap push list
- save()
    - Change settings to the device
- sendStatusBarNotification()
    - Show a Statusbar notification
    - (neeeds to be implmented for each driver)
- showToastNotification
    - Show a Toast Notification
    - (neeeds to be implmented for each driver)
- updateDeviceBadge
    - Update the Badge
    - (neeeds to be implmented for each driver)
- register
    - register the app/device against the Push Notification Server
- unregister
    - unregister the app/device against the Push Notification Server


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
