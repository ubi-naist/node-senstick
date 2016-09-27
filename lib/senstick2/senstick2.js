'use strict';

const NobleDevice = require('noble-device');
const SenStick2ControlService = require('./ControlService');
const SenStick2MetaDataReadoutService = require('./MetaDataService');
const SenStick2SensorService = require('./SensorService');
const SenStick2AccelerometerService = require('./Accelerometer');
const SenStick2GyroscopeService = require('./Gyroscope');
const SenStick2MagneticFieldSensor = require('./MagneticFieldSensor');
const SenStick2IlluminanceSensorService = require('./IlluminanceSensor');
const SenStick2UVSensor = require('./UVSensor');
const SenStick2HumiditySensor = require('./HumiditySensor');
const SenStick2PressureSensor = require('./PressureSensor');
const SenStick2Helpers = require('./Helpers');

/**
 * SenStick2は，SenStick2を扱うためのクラスです．このクラスを直接newしないでください．
 * @mixes NobleDevice.BatteryService
 * @mixes NobleDevice.DeviceInformationService
 * @mixes SenStick2ControlService
 * @mixes SenStick2MetaDataReadoutService
 * @mixes SenStick2SensorService
 * @mixes SenStick2AccelerometerService
 * @mixes SenStick2GyroscopeService
 * @mixes SenStick2MagneticFieldSensor
 * @mixes SenStick2IlluminanceSensorService
 * @mixes SenStick2UVSensor
 * @mixes SenStick2HumiditySensor
 * @mixes SenStick2PressureSensor
 * @mixes SenStick2Helpers
 * @constructor
 * @param {object}  peripheral - ペリフェラル
**/
var SenStick2 = function(peripheral)
{
    NobleDevice.call(this, peripheral);
};

NobleDevice.Util.inherits(SenStick2, NobleDevice);
NobleDevice.Util.mixin(SenStick2, NobleDevice.BatteryService);
NobleDevice.Util.mixin(SenStick2, NobleDevice.DeviceInformationService);
NobleDevice.Util.mixin(SenStick2, SenStick2ControlService);
NobleDevice.Util.mixin(SenStick2, SenStick2MetaDataReadoutService);
NobleDevice.Util.mixin(SenStick2, SenStick2SensorService);
NobleDevice.Util.mixin(SenStick2, SenStick2AccelerometerService);
NobleDevice.Util.mixin(SenStick2, SenStick2GyroscopeService);
NobleDevice.Util.mixin(SenStick2, SenStick2MagneticFieldSensor);
NobleDevice.Util.mixin(SenStick2, SenStick2IlluminanceSensorService);
NobleDevice.Util.mixin(SenStick2, SenStick2UVSensor);
NobleDevice.Util.mixin(SenStick2, SenStick2HumiditySensor);
NobleDevice.Util.mixin(SenStick2, SenStick2PressureSensor);
NobleDevice.Util.mixin(SenStick2, SenStick2Helpers);

SenStick2.SCAN_UUIDS = ['f000200004514000b000000000000000'];
/**
 *
**/
/*
SenStick2.is = function(peripheral)
{
    //if(typeof peripheral.advertisement.localName === 'undefined') return false;
    //return peripheral.advertisement.localName.indexOf('SENSTICK2') != -1;
    //console.log(peripheral.advertisement.localName);
    //return (peripheral.advertisement.localName === 'SENSTICK2-35');
    if(peripheral.services === undefined || peripheral.services === null) return false;
    return peripheral.services.indexOf('f000200004514000b000000000000000') != -1;
};
*/

module.exports = SenStick2;
