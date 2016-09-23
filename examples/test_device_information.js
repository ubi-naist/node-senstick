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
            console.log('read device information');
            senstick.readDeviceInformation(function(error, info)
            {
                console.log('info: ', info);
                console.log('error: %s', error);
                callback();
            });
            console.log('matte masu.');
        },
        function(callback)
        {
            console.log('disconnect');
            senstick.disconnect();
            callback();
        }
    ]);
});
