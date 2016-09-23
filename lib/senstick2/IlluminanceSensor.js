'use strict';

// 照度センササービス
var SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID       = 'f000210304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR   = 'f000710304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_REALTIME_DATA_CHAR        = 'f000720304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_TARGET_LOGID_CHAR         = 'f000730304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_LOGMETADATA_CHAR          = 'f000740304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_LOGDATA_CHAR              = 'f000750304514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2IlluminanceSensorServiceは，照度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 */
function SenStick2IlluminanceSensorService()
{
}

/**
 * 照度センサの計測動作を取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, operation_mode, sampling_period, measurement_range)の形をとる．
**/
SenStick2IlluminanceSensorService.prototype.readIlluminanceMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 照度センサの計測動作を設定する
 * @param       operation_mode      動作モード
 *                                  (0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param       sampling_period     サンプル周期(ミリ秒)
 * @param       measurement_range   センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param       callback            コールバック関数
 *              callbackはfunction(error)の形をとる．
**/
SenStick2IlluminanceSensorService.prototype.writeIlluminanceMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 照度センサを有効にする
 * @param       logging_flag        ロギングの有効・無効を表すフラグ
 *                                  @arg true  : ロギングを有効にする
 *                                  @arg false : ロギングを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2IlluminanceSensorService.prototype.enableIlluminanceSensor = function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};
/**
 * 照度センサを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2IlluminanceSensorService.prototype.disableIlluminanceSensor = function(callback)
{
    this.disableSensor(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 照度センサのサンプル周期を設定する
 * @param       sampling_period     ミリ秒単位のサンプル周期
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
 */
SenStick2IlluminanceSensorService.prototype.writeIlluminanceSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 照度センサのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2IlluminanceSensorService.prototype.notifyIlluminance = function(callback)
{
    this.onIlluminanceChangeBinded = this.onIlluminanceChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_REALTIME_DATA_CHAR,
        true,
        this.onIlluminanceChangeBinded,
        callback
    );
};

/**
 * 照度センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2IlluminanceSensorService.prototype.unnotifyIlluminance = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_REALTIME_DATA_CHAR,
        false,
        this.onIlluminanceChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた照度センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2IlluminanceSensorService.prototype.onIlluminanceChange = function(data)
{
    this.emit('illuminanceChange', data.readUInt16LE(0));
}

/**
 * 照度センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
SenStick2IlluminanceSensorService.prototype.writeIlluminanceLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 照度センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writeIlluminanceLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
 */
SenStick2SensorService.prototype.readIlluminanceLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 照度センサのログデータの読み出しを開始する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
/*SenStick2IlluminanceSensorService.prototype.startReadoutIlluminanceLog = function(target_log_id, start_position, callback)
{
    this.notifyIlluminanceLogData(
        function(error)
        {
            if(error) return callback(error);
            this.writeIlluminanceLogReadoutTargetID(
                target_log_id,
                start_position,
                callback
            );
        }.bind(this)
    );
};*/

/**
 * 照度センサのログデータの読み出しをする
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
/*SenStick2IlluminanceSensorService.prototype.startReadoutIlluminanceLog = function(target_log_id, start_position, callback)
{
    this.notifyIlluminanceLogData(
        function(error)
        {
            if(error) return callback(error);
            this.writeIlluminanceLogReadoutTargetID(
                target_log_id,
                start_position,
                callback
            );
        }.bind(this)
    );
};*/

/**
 * 照度センサのログデータを取得する
 */
/*
SenStick2IlluminanceSensorService.prototype.readIlluminanceLogData = function(target_log_id, start_position, callback)
{
    this.onIlluminanceReadLogDataFinishedBinded = callback.bind(this);
    this.illuminance_log_data = [];

    this.notifyIlluminanceLogData(
        function(error)
        {
            if(error)
            {
                return this.unnotifyIlluminanceLogMetaData(
                    function(error_u) { if(error_u) { return callback(error_u + "\n" + error); } else { return callback(error); } }
                );
            }
            this.writeIlluminanceLogReadoutTargetID(
                target_log_id,
                start_position,
                function(error)
                {
                    if(error) return callback(error);
                }
            );
        }.bind(this)
    );
};
*/

/**
 * 照度センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2IlluminanceSensorService.prototype.notifyIlluminanceLogData = function(callback)
{
    this.onIlluminanceLogDataChangeBinded = this.onIlluminanceLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_LOGDATA_CHAR,
        true,
        this.onIlluminanceLogDataChangeBinded,
        callback
    );
};

/**
 * 照度センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2IlluminanceSensorService.prototype.unnotifyIlluminanceLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_LOGDATA_CHAR,
        false,
        this.onIlluminanceLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた照度センサログデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2IlluminanceSensorService.prototype.onIlluminanceLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readUInt16LE(1+i*2));
    }
    this.emit('illuminanceLogDataReceived', number_of_data, sensor_data);
};

/**
 * 照度センサの測定レンジに対応する換算値を取得する
 * 照度センサから取得した数値を物理値[単位:lux]に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2IlluminanceSensorService.prototype.getIlluminanceConversionValue = function(range)
{
    if(range == 0) return 1;
    return null;
};

module.exports = SenStick2IlluminanceSensorService;
