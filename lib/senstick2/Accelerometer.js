'use strict';

// 加速度センササービス
var SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID       = 'f000210004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR   = 'f000710004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_REALTIME_DATA_CHAR        = 'f000720004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_TARGET_LOGID_CHAR         = 'f000730004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_LOGMETADATA_CHAR          = 'f000740004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_LOGDATA_CHAR              = 'f000750004514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2AccelerometerSensorServiceは，加速度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 */
function SenStick2AccelerometerSensorService()
{
}

/**
 * 加速度センサの計測動作を取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, operation_mode, sampling_period, measurement_range)の形をとる．
**/
SenStick2AccelerometerSensorService.prototype.readAccelerometerMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 加速度センサの計測動作を設定する
 * @param       operation_mode      動作モード
 *                                  (0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param       sampling_period     サンプル周期(ミリ秒)
 * @param       measurement_range   センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param       callback            コールバック関数
 *              callbackはfunction(error)の形をとる．
**/
SenStick2AccelerometerSensorService.prototype.writeAccelerometerMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 加速度センサを有効にする
 * @param       logging_flag        ロギングの有効・無効を表すフラグ
 *                                  @arg true  : ロギングを有効にする
 *                                  @arg false : ロギングを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2AccelerometerSensorService.prototype.enableAccelerometer= function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 加速度センサを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2AccelerometerSensorService.prototype.disableAccelerometer = function(callback)
{
    this.disableSensor(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 加速度センサのサンプル周期を設定する．
 * @param {number}      sampling_period - ミリ秒単位のサンプル周期
 * @param {callback}    callback        - コールバック関数
 */
SenStick2AccelerometerSensorService.prototype.writeAccelerometerSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 加速度センサのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2AccelerometerSensorService.prototype.notifyAccelerometer = function(callback)
{
    this.onAccelerometerChangeBinded = this.onAccelerometerChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_REALTIME_DATA_CHAR,
        true,
        this.onAccelerometerChangeBinded,
        callback
    );
};

/**
 * 加速度センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2AccelerometerSensorService.prototype.unnotifyAccelerometer = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_REALTIME_DATA_CHAR,
        false,
        this.onAccelerometerChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた加速度センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2AccelerometerSensorService.prototype.onAccelerometerChange = function(data)
{
    this.convertAccelerometer(
        data,
        function(x, y, z)
        {
            this.emit('accelerometerChange', x, y, z);
        }.bind(this)
    );
};

/**
 * SenStickから送られてきたデータを加速度データに変換する
 */
SenStick2AccelerometerSensorService.prototype.convertAccelerometer = function(data, callback)
{
    var x = data.readInt16LE(0);
    var y = data.readInt16LE(2);
    var z = data.readInt16LE(4);
    callback(x, y, z);
};

/**
 * 加速度センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
SenStick2AccelerometerSensorService.prototype.writeAccelerometerLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 加速度センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writeAccelerometerLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
 */
SenStick2SensorService.prototype.readAccelerometerLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 加速度センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2AccelerometerSensorService.prototype.notifyAccelerometerLogData = function(callback)
{
    this.onAccelerometerLogDataChangeBinded = this.onAccelerometerLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_LOGDATA_CHAR,
        true,
        this.onAccelerometerLogDataChangeBinded,
        callback
    );
};

/**
 * 加速度センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2AccelerometerSensorService.prototype.unnotifyAccelerometerLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_LOGDATA_CHAR,
        false,
        this.onAccelerometerLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた加速度センサログデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2AccelerometerSensorService.prototype.onAccelerometerLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        var elm = [data.readInt16LE(1+i*6), data.readInt16LE(3+i*6), data.readInt16LE(5+i*6)];
        sensor_data.push(elm);
    }
    this.emit('accelerometerLogDataReceived', number_of_data, sensor_data);
};


/**
 * 加速度センサの測定レンジに対応する換算値を取得する
 * 加速度センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2AccelerometerSensorService.prototype.getAccelerometerConversionValue = function(range)
{
    switch(range)
    {
    case 0: return 16384;
    case 1: return 8192;
    case 2: return 4096;
    case 3: return 2048;
    }
    return null;
};

module.exports = SenStick2AccelerometerSensorService;
