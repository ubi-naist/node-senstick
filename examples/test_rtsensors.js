// example program
// receive 7 sensors data

var async = require('async');
var SenStick = require('../index.js');
var readline = require('readline');

SenStick.discover(
    function(senstick)
    {
        console.log('discovered : ' + senstick);

        senstick.on(
            'disconnect',
            function()
            {
                console.log('we got disconnected!');
                console.log('bye bye');
                process.exit();
            }
        );

        senstick.on(
            'accelerometerChange',
            function(x, y, z){ readline.cursorTo(process.stdout, 0, 5); console.log('update accelerometer: ' + x + ',' + y + ',' + z); }
        );
        senstick.on(
            'gyroscopeChange',
            function(x, y, z){ readline.cursorTo(process.stdout, 0, 6); console.log('update gyroscope: ' + x + ',' + y + ',' + z); }
        );
        senstick.on(
            'magneticfieldChange',
            function(value){ readline.cursorTo(process.stdout, 0, 7); console.log('update magneticfield: ' + value); }
        );
        senstick.on(
            'illuminanceChange',
            function(value){ readline.cursorTo(process.stdout, 0, 8); console.log('update illuminance: ' + value); }
        );
        senstick.on(
            'UVChange',
            function(value){ readline.cursorTo(process.stdout, 0, 9); console.log('update UV: ' + value); }
        );
        senstick.on(
            'humidityChange',
            function(rh, t){ readline.cursorTo(process.stdout, 0, 10); console.log('update humidity: ' + rh + ',' + t); }
        );
        senstick.on(
            'pressureChange',
            function(value){ readline.cursorTo(process.stdout, 0, 11); console.log('update pressure: ' + value); }
        );

        async.series([
            // setup
            function(callback)
            {
                console.log('connectAndSetUp');
                senstick.connectAndSetUp(callback);
            },
            // check BatteryLevel
            function(callback)
            {
                console.log('readBatteryLevel');
                senstick.readBatteryLevel(
                    function(error, value)
                    {
                        console.log('\tlevel = ' + value + '%');
                        console.log('\terror = ' + error);
                        callback();
                    }
                    );
            },

            // SenStickControl
            function(callback)
            {
                console.log('readControlStatus');
                senstick.readControlStatus(
                    function(error, status)
                    {
                        console.log('\tstatus = ' + status);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readInternalStorageState');
                senstick.readInternalStorageState(
                    function(error, storage_error_code)
                    {
                        console.log('\tstorage_error_code = ' + storage_error_code);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('writeInternalDatetime');
                var date = new Date();
                senstick.writeInternalDatetime(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },     
            function(callback)
            {
                console.log('readInternalDatetime');
                senstick.readInternalDatetime(
                    function(error, datetime)
                    {
                        console.log('\tdatetime = ' + datetime);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },

            // enable each sensor
            function(callback)
            {
                console.log('enableAccelerometer');
                senstick.enableAccelerometer(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('enableGyroscope');
                senstick.enableGyroscope(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('enableMagneticFieldSensor');
                senstick.enableMagneticFieldSensor(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },            
            function(callback)
            {
                console.log('enableIlluminanceSensor');
                senstick.enableIlluminanceSensor(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('enableUVSensor');
                senstick.enableUVSensor(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('enableHumiditySensor');
                senstick.enableHumiditySensor(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('enablePressureSensor');
                senstick.enablePressureSensor(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            // enable notification
            function(callback)
            {
                console.log('notifyAccelerometer');
                senstick.notifyAccelerometer(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyGyroscope');
                senstick.notifyGyroscope(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyMagneticField');
                senstick.notifyMagneticField(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyIlluminance');
                senstick.notifyIlluminance(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyUV');
                senstick.notifyUV(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyHumidity');
                senstick.notifyHumidity(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyPressure');
                senstick.notifyPressure(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },

            function(callback)
            {
                console.log('start logging');
                senstick.startSensingAndLogging(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            // wait 10 seconds
            function(callback)
            {
                readline.cursorTo(process.stdout, 0, 5);
                readline.clearScreenDown(process.stdout);
                console.log('wait a minute');
                setTimeout(callback, 10000);
            },
            // stop logging
            function(callback)
            {
                readline.cursorTo(process.stdout, 0, 14);
                console.log('stop logging');
                senstick.stopSensingAndLogging(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyAccelerometer');
                senstick.unnotifyAccelerometer(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyGyroscope');
                senstick.unnotifyGyroscope(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyMagneticField');
                senstick.unnotifyMagneticField(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyIlluminance');
                senstick.unnotifyIlluminance(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyUV');
                senstick.unnotifyUV(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyHumidity');
                senstick.unnotifyHumidity(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyPressure');
                senstick.unnotifyPressure(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            // disconnect
            function(callback)
            {
                console.log('disconnect');
                senstick.disconnect(callback);
            }
        ]);
    }
);
