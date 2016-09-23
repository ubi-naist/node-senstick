'use strict';

// 角速度センササービス
const SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID       = 'f000210104514000b000000000000000';
const SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR   = 'f000710104514000b000000000000000';
const SENSTICK2_GYROSCOPE_REALTIME_DATA_CHAR        = 'f000720104514000b000000000000000';
const SENSTICK2_GYROSCOPE_TARGET_LOGID_CHAR         = 'f000730104514000b000000000000000';
const SENSTICK2_GYROSCOPE_LOGMETADATA_CHAR          = 'f000740104514000b000000000000000';
const SENSTICK2_GYROSCOPE_LOGDATA_CHAR              = 'f000750104514000b000000000000000';

// var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2GyroscopeSensorServiceは，角速度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 */
function SenStick2GyroscopeSensorService()
{
}

/**
 * 角速度センサの計測動作を取得する
 * @param {function(string, number, number, number)} callback - コールバック関数
 *              callbackはfunction(error, operation_mode, sampling_period, measurement_range)の形をとる．
**/
SenStick2GyroscopeSensorService.prototype.readGyroscopeMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 角速度センサの計測動作を設定する
 * @param       operation_mode      動作モード
 *                                  (0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param       sampling_period     サンプル周期(ミリ秒)
 * @param       measurement_range   センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param       callback            コールバック関数
 *              callbackはfunction(error)の形をとる．
**/
SenStick2GyroscopeSensorService.prototype.writeGyroscopeMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 角速度センサを有効にする
 * @param       logging_flag        ロギングの有効・無効を表すフラグ
 *                                  @arg true  : ロギングを有効にする
 *                                  @arg false : ロギングを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2GyroscopeSensorService.prototype.enableGyroscope= function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 角速度センサを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2GyroscopeSensorService.prototype.disableGyroscope = function(callback)
{
    this.disableSensor(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 角速度センサのサンプル周期を設定する
 * @param       sampling_period     ミリ秒単位のサンプル周期
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
 */
SenStick2GyroscopeSensorService.prototype.writeGyroscopeSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 角速度センサのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2GyroscopeSensorService.prototype.notifyGyroscope = function(callback)
{
    this.onGyroscopeChangeBinded = this.onGyroscopeChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_REALTIME_DATA_CHAR,
        true,
        this.onGyroscopeChangeBinded,
        callback
    );
};

/**
 * 角速度センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2GyroscopeSensorService.prototype.unnotifyGyroscope = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_REALTIME_DATA_CHAR,
        false,
        this.onGyroscopeChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた角速度センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2GyroscopeSensorService.prototype.onGyroscopeChange = function(data)
{
    this.convertGyroscope(
        data,
        function(x, y, z)
        {
            this.emit('gyroscopeChange', x, y, z);
        }.bind(this)
    );
}

/**
 * SenStickから送られてきたデータを角速度データに変換する
 */
SenStick2GyroscopeSensorService.prototype.convertGyroscope = function(data, callback)
{
    var x = data.readInt16LE(0);
    var y = data.readInt16LE(2);
    var z = data.readInt16LE(4);
    callback(x, y, z);
};

/**
 * 角速度センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
SenStick2GyroscopeSensorService.prototype.writeGyroscopeLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 角速度センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writeGyroscopeLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
 */
SenStick2GyroscopeSensorService.prototype.readGyroscopeLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 角速度センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2GyroscopeSensorService.prototype.notifyGyroscopeLogData = function(callback)
{
    this.onGyroscopeLogDataChangeBinded = this.onGyroscopeLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_LOGDATA_CHAR,
        true,
        this.onGyroscopeLogDataChangeBinded,
        callback
    );
};

/**
 * 角速度センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2GyroscopeSensorService.prototype.unnotifyGyroscopeLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_LOGDATA_CHAR,
        false,
        this.onGyroscopeLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた角速度センサログデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2GyroscopeSensorService.prototype.onGyroscopeLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        var elm = [data.readInt16LE(1+i*6), data.readInt16LE(3+i*6), data.readInt16LE(5+i*6)];
        sensor_data.push(elm);
    }
    this.emit('gyroscopeLogDataReceived', number_of_data, sensor_data);
};

/**
 * 角速度センサの測定レンジに対応する換算値を取得する
 * 角速度センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2GyroscopeSensorService.prototype.getGyroscopeConversionValue = function(range)
{
    switch(range)
    {
    case 0: return 131;
    case 1: return 65.5;
    case 2: return 32.8;
    case 3: return 16.4;
    }
    return null;
};

module.exports = SenStick2GyroscopeSensorService;
