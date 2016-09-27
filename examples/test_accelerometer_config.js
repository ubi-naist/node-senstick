'use strict';

const SenStick = require('../index');
const async = require('async');

SenStick.discover(function(senstick)
{
    async.series([
        function(callback)
        {
            console.log('senstick found: %s', senstick.uuid);
            console.log('connect and setup');

            senstick.connectAndSetUp(callback);
        },
        function(callback)
        {
            console.log('read accelerometer config');
            senstick.readAccelerometerMeasurementConfig(function(error, operation_mode, sampling_period, measurement_range)
            {
                console.log('  operation mode: %d', operation_mode);
                console.log('  sampling_period: %d', sampling_period);
                console.log('  measurement_range: %d', measurement_range);
                console.log('error: %s', error);
                callback();
            });
        },
        function(callback)
        {
            const operation_mode = 0x03;        // sensing and logging 
            const sampling_period = 500;        // 500 ms
            const measurement_range = 0x00;     // 2G
            console.log('write accelerometer config');
            console.log('  operation mode: %d', operation_mode);
            console.log('  sampling period: %d', sampling_period);
            console.log('  measurement range: %s', measurement_range);
            senstick.writeAccelerometerMeasurementConfig(operation_mode, sampling_period, measurement_range, function(error)
            {
                console.log('error: %s', error);
                callback();
            });
        },
        function(callback)
        {
            console.log('read accelerometer config to check');
            senstick.readAccelerometerMeasurementConfig(function(error, operation_mode, sampling_period, measurement_range)
            {
                console.log('  operation mode: %d', operation_mode);
                console.log('  sampling_period: %d', sampling_period);
                console.log('  measurement_range: %d', measurement_range);
                console.log('error: %s', error);
                callback();
            });
        },
        function(callback)
        {
            console.log('disconnect');
            senstick.disconnect();
            callback();
        }
    ]);
});
