'use strict';

// センサーサービス

/**
 * SenStick2SensorServiceはセンサそれぞれのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 *     読み出し機能を提供する．以下のメソッドは直接使われない．
 * @mixin
 */
function SenStick2SensorService(){}

/**
 * 計測動作を取得する
 * @param {string}                  service_uuid    - 対象センサのサービスUUID
 * @param {string}                  characteristics - 対象センサの計測設定のUUID
 * @param {SensorConfigCallback}    callback        - コールバック関数
 * @private
**/
SenStick2SensorService.prototype.readMeasurementConfig = function(service_uuid, characteristics, callback)
{
    this.readDataCharacteristic(
        service_uuid,
        characteristics,
        function(error, data)
        {
            if(error)
            {
                return callback(error);
            }
            var opmode = data.readUInt8(0);
            var sampper = data.readUInt16LE(1);
            var measrange = data.readUInt16LE(3);
            callback(null, opmode, sampper, measrange);
        }
    );
};

/**
 * 計測動作を指定する
 * @param {string}      service_uuid        - 計測動作指定対象のセンサのサービスUUID
 * @param {string}      characteristics     - 計測動作指定対象のセンサの計測設定のUUID
 * @param {number}      operation_mode      - 動作モード(0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param {number}      sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}      measurement_range   - センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param {callback}    callback            - コールバック関数
 * @private
**/
SenStick2SensorService.prototype.writeMeasurementConfig = function(service_uuid, characteristics, operation_mode, sampling_period, measurement_range, callback)
{
    if(operation_mode != 0x00 && operation_mode != 0x01 && operation_mode != 0x03)
    {
        callback('invalid operation mode (expect:0x00, 0x02 or 0x03)');
        return;
    }
    var buffer = new Buffer(5);
    buffer.writeUInt8(operation_mode, 0);
    buffer.writeUInt16LE(sampling_period, 1);
    buffer.writeUInt16LE(measurement_range, 3);
    this.writeDataCharacteristic(service_uuid, characteristics, buffer, callback);
};

/**
 * センサを有効にする
 * @param {string}      service_uuid        - 動作モード変更対象のセンサのサービスUUID
 * @param {string}      characteristics     - 動作モード変更対象センサの計測設定のUUID
 * @param {boolean}     logging_flag        - ロギングの有効・無効を表すフラグ
 *                                              true  : ロギングを有効にする
 *                                              false : ロギングを無効にする
 * @param {callback}    callback            - コールバック関数
 * @private
*/
SenStick2SensorService.prototype.enableSensor = function(service_uuid, characteristics, logging_flag, callback)
{
    var opmode = logging_flag ? 0x03 : 0x01;
    var sampper;
    var measrange;
    this.readMeasurementConfig(
        service_uuid,
        characteristics,
        function(error, o, s, m)
        {
            if(error) return callback(error);
            sampper = s;
            measrange = m;
            this.writeMeasurementConfig(
                service_uuid,
                characteristics,
                opmode,
                sampper,
                measrange,
                callback
            );
        }.bind(this)
    );
};

/**
 * センサを無効にする
 * @param {string}      service_uuid    - 動作モード変更対象のセンサのサービスUUID
 * @param {string}      characteristics - 動作モード変更対象センサの計測設定のUUID
 * @param {callback}    callback        - コールバック関数
 * @private
*/
SenStick2SensorService.prototype.disableSensor = function(service_uuid, characteristics, callback)
{
    var sampper;
    var measrange;
    this.readMeasurementConfig(
        service_uuid,
        characteristics,
        function(error, o, s, m)
        {
            if(error) return callback(error);
            sampper = s;
            measrange = m;
            this.writeMeasurementConfig(
                service_uuid,
                characteristics,
                0x00,
                sampper,
                measrange,
                callback
            );
        }.bind(this)
    );
};

/**
 * センサのサンプル周期を設定する
 * @param {string}      service_uuid    - 動作モード変更対象のセンサのサービスUUID
 * @param {string}      characteristics - 動作モード変更対象センサの計測設定のUUID
 * @param {number}      sampling_period - ミリ秒単位のサンプル周期
 * @param {callback}    callback        - コールバック関数
 * @private
 */
SenStick2SensorService.prototype.writeSensorSamplingPeriod = function(service_uuid, characteristics, sampling_period, callback)
{
    var opmode;
    var measrange;
    this.readMeasurementConfig(
        service_uuid,
        characteristics,
        function(error, o, s, m)
        {
            if(error) return callback(error);
            opmode = o;
            measrange = m;
            this.writeMeasurementConfig(
                service_uuid,
                characteristics,
                opmode,
                sampling_period,
                measrange,
                callback
            );
        }.bind(this)
    );
};

/**
 * センサの測定レンジを設定する
 * @param {string}      service_uuid            - 動作モード変更対象のセンサのサービスUUID
 * @param {string}      characteristics         - 動作モード変更対象センサの計測設定のUUID
 * @param {number}      measurement_range       - センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param {callback}    callback                - コールバック関数
 * @private
 */
SenStick2SensorService.prototype.writeSensorMeasurementRange = function(service_uuid, characteristics, measurement_range, callback)
{
    var opmode;
    var sampper;
    this.readMeasurementConfig(
        service_uuid,
        characteristics,
        function(error, o, s, m) // eslint-disable-line
        {
            if(error) return callback(error);
            opmode = o;
            sampper = s;
            this.writeMeasurementConfig(
                service_uuid,
                characteristics,
                opmode,
                sampper,
                measurement_range,
                callback
            );
        }.bind(this)
    );
};

/**
 * センサのログデータを取得する
 * @param       service_uuid        ログデータ読み出し対象のセンサのサービスUUID
 * @param       log_characteristics     ログデータ読み出し対象のセンサの読み出し対象ログIDのUUID
 */
// onhandler : 各センサで， ~binded = ~ を作って，それを指定するようにする．その後，このメソッドを呼び出す
/*
SenStick2SensorService.prototype.startReadoutLogData = function(service_uuid, log_characteristics, meta_characteristics, data_characteristics, target_log_id, start_position, onhandler, callback)
{
    var buffer = new Buffer(7);
    buffer.writeUInt8(target_log_id, 0);
    buffer.writeUInt16LE(0x00, 1);
    buffer.writeUInt32LE(start_position, 3);

    this.notifySensorLogMetaData(
        service_uuid,
        meta_characteristics,
        function(error_lmd)
        {
            if(error) return callback(error_lmd);
            this.writeDataCharacteristic(
                service_uuid,
                log_characteristics,
                buffer,
                function(error_wdc)
                {
                    if(error_wdc) return callback(error_wdc);
                }.bind(this)
            );
        }.bind(this)
    );
};
*/
/**
 * 読み出し対象ログIDを設定する
 * @param {string}      service_uuid            - ログ読み出し対象のセンサのサービスUUID．
 * @param {string}      characteristics         - 読み出し対象のログIDを設定するキャラクタリスティックのUUID．
 * @param {number}      target_log_id           - 読み出し対象のログID．
 * @param {number}      start_position          - サンプル数単位の読み出し開始位置．
 * @param {callback}    callback                - コールバック関数．
 * @private
 */
SenStick2SensorService.prototype.writeSensorLogReadoutTargetID = function(service_uuid, characteristics, target_log_id, start_position, callback)
{
    var buffer = new Buffer(7);
    buffer.writeUInt8(target_log_id, 0);
    buffer.writeUInt16LE(0x00, 1);
    buffer.writeUInt32LE(start_position, 3);

    this.writeDataCharacteristic(
        service_uuid,
        characteristics,
        buffer,
        callback
    );
};

/**
 * センサのログメタデータを取得する
 * このメソッドを呼び出す前に，writeSensorLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 * ようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param {string}      service_uuid            読み出し対象のセンサのサービスUUID
 * @param {string}      characteristics     対象ログIDのUUID
 * @param {}      callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
 * @private
 */
SenStick2SensorService.prototype.readSensorLogMetaData = function(service_uuid, characteristics, callback)
{
    // メタデータを取るためには，まず読み出し対象ログIDに書き込まないといけないらしい
    this.readDataCharacteristic(
        service_uuid,
        characteristics,
        function(error, data)
        {
            if(error) return callback(error);
            this.convertSensorLogMetaData(
                data,
                function(target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)
                {
                    callback(null, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage);
                }
            );
        }.bind(this)
    );
};

/**
 * 
 */

/**
 * SenStickから送られてきたログメタデータを解析する．
 * @param {Array}                               data        - aaa
 * @param {}                                    callback    - コールバック関数．
 * @private
 */
SenStick2SensorService.prototype.convertSensorLogMetaData = function(data, callback)
{
    var target_log_id = data.readUInt8(0);
    var sampling_period = data.readUInt16LE(1);
    var measurement_range = data.readUInt16LE(3);
    var number_of_samples = data.readUInt32LE(5);
    var reading_position = data.readUInt32LE(9);
    var remaining_storage = data.readUInt32LE(13);
    callback(target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage);
};
/**
 * 
 */
/*
SenStick2SensorService.prototype.finishReadoutLogData = function(service_uuid, log_characteristics, meta_characteristics, data_characteristics, onhandler, callback)
{
    this.unnotifySensorLogMetaData(
        service_uuid,
        meta_characteristics,

    )
};*/

/**
 * センサのログメタデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
/*
SenStick2SensorService.prototype.notifySensorLogMetaData = function(service_uuid, characteristics, onhandler, callback)
{
    //this.onIlluminanceLogMetaDataChangeBinded[characteristics] = this.onIlluminanceLogMetaDataChange.bind(this);
    this.notifyCharacteristic(
        service_uuid,
        characteristics,
        true,
        onhandler,
        callback
    );
};
*/
/**
 * センサのログメタデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
/*
SenStick2SensorService.prototype.unnotifySensorLogMetaData = function(service_uuid, characteristics, onhandler, callback)
{
    this.notifyCharacteristic(
        service_uuid,
        characteristics,
        false,
        onhandler,
        callback
    );
};
*/

/**
 * コールバック関数
 * @callback SensorConfigCallback
 * @param {string|null} error           - エラー内容．エラーが無ければnull．
 * @param {number} operation_mode       - センサー・サービスの動作モード．
 * @param {number} sampling_period      - ミリ秒単位のサンプル周期．
 * @param {number} measurement_range    - センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 */

/**
 * コールバック関数
 * @callback callback
 * @param {string} error    - エラー内容．エラーが無ければnull．
 */

module.exports = SenStick2SensorService;
