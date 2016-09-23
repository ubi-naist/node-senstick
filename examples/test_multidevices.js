// example program
// using multi sensticks

var async = require('async');
var SenStick = require('./index.js');

// display log
function log(message, ...optionalParams)
{
    const dt = new Date();
    const yyyy = ('0' + dt.getFullYear()).slice(-2);
    const mm = ('0' + (dt.getMonth() + 1)).slice(-2);
    const dd = ('0' + dt.getDate()).slice(-2);
    const hh = ('0' + dt.getHours()).slice(-2);
    const mi = ('0' + dt.getMinutes()).slice(-2);
    const ss = ('0' + dt.getSeconds()).slice(-2);
    const mmm = ('00' + dt.getMilliseconds()).slice(-3);
    const dt_str = '[' + yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss + '.' + mmm + ']';
    message = '%s: ' + message;
    console.log(message, dt_str, ...optionalParams);
}

// SenStick Device Class
var SenStickDevice = function(senstick)
{
    this.senstick = senstick;
    var device_name = senstick._peripheral.advertisement.localName;

    this.senstick.once(
        'disconnect',
        function()
        {
            log(device_name, 'disconnected');
        }.bind(this)
    );

    this.senstick.on(
        'accelerometerChange',
        function(x, y, z)
        {
            log(device_name, x + ',' + y + ',' + z);
        }.bind(this)
    );

    // enable sensors
    this.enableSensors = function(callback)
    {
        async.series([
            // enable accelerometer
            function(callback_s)
            {
                this.senstick.enableAccelerometer(
                    false,
                    function(error)
                    {
                        if(error) log(device_name, 'enable sensors error = ' + error);
                        callback_s();
                    }.bind(this)
                );
            }.bind(this),
            // enable notification
            function(callback_s)
            {
                this.senstick.notifyAccelerometer(
                    function(error)
                    {
                        if(error) log(device_name, 'notify accelerometer error = ' + error);
                        callback_s();
                    }.bind(this)
                );
            }.bind(this),
            function(callback_s)
            {
                callback_s();
                callback();
            }.bind(this)
        ]);
    };

    // start sensing
    this.startSensing = function(callback)
    {
        var self = this;
        this.senstick.startSensingAndLogging(
            function(error)
            {
                if(error) log(device_name, 'start sensing error = ' + error);
                callback();
            }.bind(self)
        );
    };

    // stop sensing
    this.stopSensing = function(callback)
    {
        var self = this;
        this.senstick.stopSensingAndLogging(
            function(error)
            {
                if(error) log(device_name, 'stop sensing error = ' + error);
                callback();
            }.bind(self)
        );
    };

};

// called when senstick is discovered
var onDiscover = function(senstick)
{
    var device = new SenStickDevice(senstick);
    var device_name = device.senstick._peripheral.advertisement.localName;

    async.series([
        // setup
        function(callback)
        {
            log(device_name, 'discovered');

            device.senstick.connectAndSetUp(
                function(error)
                {
                    if(error) log(device_name, 'connectAndSetUp error = ' + error);
                    else
                    {
                        log(device_name, 'connected');
                    }
                    callback();
                }
            );
        },
        // enable sensors
        function(callback)
        {
            device.enableSensors(callback);
        },
        // start sensing
        function(callback)
        {
            device.startSensing(callback);
        },
        // wait until press return key
        function(callback)
        {
            //setTimeout(callback, 10000);
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', function() { callback(); });
        },
        // stop sensing
        function(callback)
        {
            SenStick.stopDiscoverAll(onDiscover);
            log(device_name, 'stop sensing');
            device.stopSensing(callback);
        },
        // disconnect
        function(callback)
        {
            log(device_name, 'disconnect');
            device.senstick.disconnect(callback);
        }
    ]);
};

SenStick.discoverAll(onDiscover);
