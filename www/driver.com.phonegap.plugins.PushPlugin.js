var pushNotification = null;
var options = null;

var onDeviceReady = function (opt) {

    options = opt;

    var pushNotification = window.plugins.pushNotification;
    if (!pushNotification) {
        console.error('please add the push plugin: cordova plugin add https://github.com/phonegap-build/PushPlugin.git');
        return;
    }
    if (!device) {
        console.error('the device plugin is not loaded. Install it via cordova plugin add org.apache.cordova.device');
        return;
    }

    if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {

        if (!options || !options.senderId) {
            console.error('No sender id given. It is mandatory for android devices');
            return;
        }

        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID": options.senderId,
                "ecb": "mCAPCordovaPushPlugin.onNotification"
            });
    }
    else {
        pushNotification.register(
            tokenHandler,
            errorHandler,
            {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "mCAPCordovaPushPlugin.onNotificationAPN"
            });
    }

    // result contains any message sent from the plugin call
    function successHandler(result) {
        if (options && options.register && typeof options.register === 'function') {
            options.register(result);
        }
    }

    // result contains any error description text returned from the plugin call
    function errorHandler(error) {
        if (options && options.error && typeof options.error === 'function') {
            options.error(error);
        }
    }

    function tokenHandler(result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        if (options && options.token && typeof options.token === 'function') {
            options.token(result);
        }
        registerDevice(result);
    }

};

function onNotificationAPN(event) {
    if (options && options.message && typeof options.message === 'function') {
        options.message(arguments);
    }
    if (event && event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound && typeof Media !== 'undefined') {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event && event.badge) {
        pushNotification.setApplicationIconBadgeNumber(function () {
            // success
        }, function () {
            // error
        }, event.badge);
    }
}

function registerDevice(token) {
    var language = window.navigator.userLanguage || window.navigator.language;
    var providerType = '';
    if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
        providerType = 'GCM';
    }
    else {
        providerType = 'APNS';
    }
    var deviceModel = mCAP.push.devices.add({
        "providerType": providerType,
        "user": mCAP.authentication.get('userName'),
        "name": device.model,
        "osVersion": device.version,
        "language": language.substr(0, 2),
        "country": language.substr(4, 5) || '',
        "token": token
    });

    deviceModel.save().then(function (data) {
        if (options && options.registerdevice && typeof options.registerdevice === 'function') {
            options.registerdevice(data);
        }
    }).fail(function (data) {
        if (options && options.registerdeviceerror && typeof options.registerdeviceerror === 'function') {
            options.registerdeviceerror(data);
        }
    });
}

// Android and Amazon Fire OS
function onNotification(e) {
    console.log(e);
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                registerDevice(e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            var type = 'SOUND';
            if (e.foreground && typeof Media !== 'undefined') {
                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/" + soundfile);
                my_media.play();
            }
            else {  // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    type = 'COLDSTART'
                }
                else {
                    type = 'BACKGROUND'
                }
            }


            if (options && options.message && typeof options.message === 'function') {
                options.message(type, e);
            }
            break;

        case 'error':
            if (options && options.error && typeof options.error === 'function') {
                options.error(e);
            }
            break;

        default:
            if (options && options.unknown && typeof options.unknown === 'function') {
                options.unknown(e);
            }
            break;
    }
}


module.exports.onDeviceReady = onDeviceReady;
module.exports.onNotificationAPN = onNotificationAPN;
module.exports.onNotification = onNotification;
