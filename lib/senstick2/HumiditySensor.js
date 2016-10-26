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
 * @mixin
 */
function SenStick2HumiditySensorService()
{
}

/**
 * 温湿度センサの計測動作を取得する．
 * @param {readHumidityMeasurementConfigCallback}   callback        コールバック関数．
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
 * 温湿度センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readHumidityMeasurementConfigCallback
 * @param {?string}     
 * @param {SensorOperationMode|undefined}   operation_mode      - 動作モード．
 * @param {number|undefined}                sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range   - 温湿度センサの測定レンジ．
 */

/**
 * 温湿度センサの計測動作を設定する．
 * @param {SensorOperationMode} operation_mode      - 動作モード．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}              measurement_range   - 温湿度センサの測定レンジ．
 * @param {callback}            callback            - コールバック関数．
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
 * 温湿度センサを有効にする．
 * @param {boolean}             logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}            callback            - コールバック関数．
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
 * 温湿度センサを無効にする．
 * @param {callback}            callback            - コールバック関数．
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
 * 温湿度センサのサンプル周期を設定する．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {callback}            callback            - コールバック関数．
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
 * 温湿度センサの測定レンジを設定する．
 * @param {number}      measurement_range       - 温湿度センサの測定レンジ．
 * @param {callback}    callback                - コールバック関数．
 */
SenStick2HumiditySensorService.prototype.writeHumidityMeasurementRange = function(measurement_range, callback)
{
    this.writeSensorMeasurementRange(
        SENSTICK2_HUMIDITY_SENSOR_SERVICE_UUID,
        SENSTICK2_HUMIDITY_MEASUREMENT_CONFIG_CHAR,
        measurement_range,
        callback
    );
};

/**
 * 温湿度センサのnotificationの受信要求を設定する．
 * @param {callback}            callback            - コールバック関数．
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
 * 温湿度センサのnotificationの受信要求を解除する．
 * @param {callback}            callback            - コールバック関数
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
 * notificationで送られてきた温湿度センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}    data - 受信したデータ．
 * @fires SenStick2HumiditySensorService#humidityChange
 * @private
 */
SenStick2HumiditySensorService.prototype.onHumidityChange = function(data)
{
    this.convertHumidity(
        data,
        function(rh, t)
        {
            /**
             * humidityChange イベント．
             * @event SenStick2HumiditySensorService#humidityChange
             * @param {number} rh   - 相対湿度．
             * @param {number} t    - 温度．
             */
            this.emit('humidityChange', rh, t);
        }.bind(this)
    );
};

/**
 * SenStickから送られてきたデータを温湿度データに変換する．
 * @param {Buffer}                          data        - 変換元のデータ．
 * @param {convertHumidityCallback}         callback    - コールバック関数．
 * @private
 */
SenStick2HumiditySensorService.prototype.convertHumidity = function(data, callback)
{
    var rh = -6.0 + 125.0 * data.readUInt16LE(0) / 65536.0;
    var t = -46.85 + 175.72 * data.readUInt16LE(2) / 65536.0;
    callback(rh, t);
};

/**
 * SenStickから送られてきたデータを加速度データに変換した際に呼び出されるコールバック関数．
 * @callback convertHumidityCallback
 * @param {number} rh   - 相対湿度．
 * @param {number} t    - 温度．
 */

/**
 * 温湿度センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
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
 * 温湿度センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writeHumidityLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {callback}    callback - コールバック関数
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
 * 加速度センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readAccelerometerLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 加速度センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 温湿度センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}            callback    - コールバック関数
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
 * @param {callback}            callback    - コールバック関数
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
 * notificationで送られてきた温湿度センサログデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}      data    - 受信したデータ
 * @fires SenStick2HumiditySensorService#humidityLogDataReceived
 * @private
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
    /**
     * humidityLogDataReceived イベント
     * @event SenStick2HumiditySensorService#humidityLogDataReceived
     * @param {number} number_of_data - sensor_dataの要素数．
     * @param {number[][]} sensor_data  - ログデータ．各要素の先頭から順に相対湿度，温度を表す．
     */
    this.emit('humidityLogDataReceived', number_of_data, sensor_data);
};

/**
 * 温湿度センサの測定レンジに対応する換算値を取得する．
 * 温湿度センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}      range           測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2HumiditySensorService.prototype.getHumidityConversionValue = function(range)
{
    if(range == 0) return 1.0;
    return null;
};

module.exports = SenStick2HumiditySensorService;
