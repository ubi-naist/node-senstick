'use strict';

// 温湿度センササービス
var SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID       = 'f000210504514000b000000000000000';
var SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR   = 'f000710504514000b000000000000000';
var SENSTICK2_HUMIDITY_REALTIME_DATA_CHAR        = 'f000720504514000b000000000000000';
var SENSTICK2_HUMIDITY_TARGET_LOGID_CHAR         = 'f000730504514000b000000000000000';
var SENSTICK2_HUMIDITY_LOGMETADATA_CHAR          = 'f000740504514000b000000000000000';
var SENSTICK2_HUMIDITY_LOGDATA_CHAR              = 'f000750504514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2HumiditySensorServiceは，温湿度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 */
function SenStick2HumiditySensorService()
{
}

/**
 * 温湿度センサの計測動作を取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, operation_mode, sampling_period, measurement_range)の形をとる．
**/
SenStick2HumiditySensorService.prototype.readHumidityMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 温湿度センサの計測動作を設定する
 * @param       operation_mode      動作モード
 *                                  (0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param       sampling_period     サンプル周期(ミリ秒)
 * @param       measurement_range   センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param       callback            コールバック関数
 *              callbackはfunction(error)の形をとる．
**/
SenStick2HumiditySensorService.prototype.writeHumidityMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 温湿度センサを有効にする
 * @param       logging_flag        ロギングの有効・無効を表すフラグ
 *                                  @arg true  : ロギングを有効にする
 *                                  @arg false : ロギングを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2HumiditySensorService.prototype.enableHumiditySensor = function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 温湿度センサを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2HumiditySensorService.prototype.disableHumiditySensor = function(callback)
{
    this.disableSensor(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 温湿度センサのサンプル周期を設定する
 * @param       sampling_period     ミリ秒単位のサンプル周期
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
 */
SenStick2HumiditySensorService.prototype.writeHumiditySamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 温湿度センサのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2HumiditySensorService.prototype.notifyHumidity = function(callback)
{
    this.onHumidityChangeBinded = this.onHumidityChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_REALTIME_DATA_CHAR,
        true,
        this.onHumidityChangeBinded,
        callback
    );
};

/**
 * 温湿度センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2HumiditySensorService.prototype.unnotifyHumidity = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_REALTIME_DATA_CHAR,
        false,
        this.onHumidityChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた温湿度センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2HumiditySensorService.prototype.onHumidityChange = function(data)
{
    this.convertHumidity(
        data,
        function(rh, t)
        {
            this.emit('humidityChange', rh, t);
        }.bind(this)
    );
}

/**
 * SenStickから送られてきたデータを温湿度データに変換する
 */
SenStick2HumiditySensorService.prototype.convertHumidity = function(data, callback)
{
    var rh = -6.0 + 125.0 * data.readUInt16LE(0) / 65536.0;
    var t = -46.85 + 175.72 * data.readUInt16LE(2) / 65536.0;
    callback(rh, t);
};

/**
 * 温湿度センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
SenStick2HumiditySensorService.prototype.writeHumidityLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 温湿度センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writeHumidityLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
 */
SenStick2SensorService.prototype.readHumidityLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 温湿度センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2HumiditySensorService.prototype.notifyHumidityLogData = function(callback)
{
    this.onHumidityLogDataChangeBinded = this.onHumidityLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_LOGDATA_CHAR,
        true,
        this.onHumidityLogDataChangeBinded,
        callback
    );
};

/**
 * 温湿度センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2HumiditySensorService.prototype.unnotifyHumidityLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_LOGDATA_CHAR,
        false,
        this.onHumidityLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた温湿度センサログデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2HumiditySensorService.prototype.onHumidityLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        var elm = [data.readUInt16LE(1+i*4), data.readUInt16LE(3+i*4)];
        sensor_data.push(elm);
    }
    this.emit('humidityLogDataReceived', number_of_data, sensor_data);
};

/**
 * 温湿度センサの測定レンジに対応する換算値を取得する
 * 温湿度センサから取得した数値を物理値[単位:RH%(相対湿度), ℃(温度)]に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2HumiditySensorService.prototype.getHumidityConversionValue = function(range)
{
    if(range == 0) return 1.0;
    return null;
};

module.exports = SenStick2HumiditySensorService;
