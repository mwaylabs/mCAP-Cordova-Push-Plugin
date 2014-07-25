var staticPushNotification = null;
mCAP.PushNotification.prototype.register = function () {
    staticPushNotification = this;
    var that = this;
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
        pushNotification.register(
            function(){
                that.trigger('register', arguments);
            },
            function(){
                that.trigger('error', arguments);
            },
            {
                "senderID": this.senderId,
                "ecb": "mCAPCordovaPushPlugin.onNotification"
            });
    }
    else {
        pushNotification.register(
            function(result){
                that.trigger('token', arguments);
                that.registerDevice(result);
            },
            function(){
                that.trigger('error', arguments);
            },
            {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "mCAPCordovaPushPlugin.onNotificationAPN"
            });
    }
};



mCAP.PushNotification.prototype.registerDevice = function(token){
    var that = this;
    var device = localStorage.getItem('mCAPCordovaPushPlugin.device');
    if(device){
        try{
            that.device.set(JSON.parse(device));
            that.device.fetch().then(function(){
                that.trigger('registerdevice', arguments);
            }).fail(function(){
                that.trigger('registerdeviceerror', arguments);
            });
        } catch(e){
            that.trigger('registerdeviceerror', e);
        }
    } else {
        that._createDevice(token).then(function(){
            try{
                localStorage.setItem('mCAPCordovaPushPlugin.device', JSON.stringify(that.device));
            }catch(e){
                that.trigger('registerdeviceerror', e);
            }
        });
    }
};

mCAP.PushNotification.prototype._createDevice = function(token){
    var that = this;
    var language = window.navigator.userLanguage || window.navigator.language;
    var providerType = '';
    if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
        providerType = 'GCM';
    }
    else {
        providerType = 'APNS';
    }
    this.device.set('providerType', providerType);
    this.device.set('user', mCAP.authentication.get('userName'));
    this.device.set('name', device.model);
    this.device.set('osVersion', device.version);
    this.device.set('language', language.substr(0, 2));
    this.device.set('country', language.substr(3, 4) || '');
    this.device.set('token', token);

    return this.device.save().then(function(){
        that.trigger('registerdevice', arguments);
    }).fail(function(){
        that.trigger('registerdeviceerror', arguments);
    });
};

mCAP.PushNotification.prototype.sendStatusBarNotification = function(alert){
    navigator.notification.alert(alert);
};

mCAP.PushNotification.prototype.updateDeviceBadge = function(badge){
    var that = this;
    var pushNotification = window.plugins.pushNotification;
    pushNotification.setApplicationIconBadgeNumber(function () {
        // success
        that.trigger('badge', arguments);
    }, function () {
        // error
        that.trigger('error', arguments);
    }, badge);
};

function onNotificationAPN(event) {
    staticPushNotification.trigger('message', arguments);
    if (event && event.alert) {
        staticPushNotification.alert(event.alert);
    }

    if (event.sound && typeof Media !== 'undefined') {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event && event.badge) {
        staticPushNotification.updateDeviceBadge(event.badge);
    }
}

// Android and Amazon Fire OS
function onNotification(e) {
    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                staticPushNotification.registerDevice(e.regid);
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


            staticPushNotification.trigger('message', arguments);
            break;

        case 'error':
            staticPushNotification.trigger('error', arguments);
            break;

        default:
            staticPushNotification.trigger('unknown', arguments);
            break;
    }
}


module.exports.onNotificationAPN = onNotificationAPN;
module.exports.onNotification = onNotification;
