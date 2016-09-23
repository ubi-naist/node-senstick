'use strict';

// Metadata読み出しサービス
var SENSTICK2_METADATA_SERVICE_UUID             = 'f000200104514000b000000000000000';
var SENSTICK2_METADATA_LOGID_CHAR               = 'f000701004514000b000000000000000';
var SENSTICK2_METADATA_LOGGINGSTARTEDTIME_CHAR  = 'f000701104514000b000000000000000';
var SENSTICK2_METADATA_ABSTRACTTEXT_CHAR        = 'f000701204514000b000000000000000';

/**
 * メタデータ読み出しサービス
 * SenStick2MetaDataReadoutServiceはログのメタ情報の読み出し機能を提供する．
**/
function SenStick2MetaDataReadoutService() {}

/**
 * 読み出し対象のログIDを取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, log_id)の形
**/
SenStick2MetaDataReadoutService.prototype.readTargetLogId = function(callback)
{
    this.readUInt8Characteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_LOGID_CHAR,
        callback
    );
};

/**
 * 読み出し対象のログIDを設定する
 * @param       log_id          ログID
 * @param       callback        コールバック関数
 *              callbackはfunction(error)の形
**/
SenStick2MetaDataReadoutService.prototype.writeTargetLogId = function(log_id, callback)
{
    this.writeUInt8Characteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_LOGID_CHAR,
        log_id,
        callback
    );
};

/**
 * ログ記録開始時間を取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, datetime)の形
                datetime[0] : year
                datetime[1] : month
                datetime[2] : day
                datetime[3] : hour
                datetime[4] : minute
                datetime[5] : second
**/
SenStick2MetaDataReadoutService.prototype.readLogLoggingStartedTimeFromTargetLog = function(callback)
{
    this.readDataCharacteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_LOGGINGSTARTEDTIME_CHAR,
        function(error, data)
        {
            if(error)
            {
                return callback(error);
            }
            this.convertLogLoggingStartedTimeFromTargetLog(
                data,
                function(year, month, day, hour, minute, second)
                {
                    callback(null, [year, month, day, hour, minute, second]);
                }
            );
        }.bind(this)
    );
};

/**
 *
 * @param       data
 * @param       callback        コールバック関数
 *              callbackはfunction(year, month, day, hour, minute, second)の形
**/
SenStick2MetaDataReadoutService.prototype.convertLogLoggingStartedTimeFromTargetLog = function(data, callback)
{
    var year = data.readUInt16LE(0);
    var month = data.readUInt8(2);
    var day = data.readUInt8(3);
    var hour = data.readUInt8(4);
    var minute = data.readUInt8(5);
    var second = data.readUInt8(6);
    callback(year, month, day, hour, minute, second);
};

/**
 * 概要テキストを取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, abstract_text)の形
**/
SenStick2MetaDataReadoutService.prototype.readLogAbstractTextFromTargetLog = function(callback)
{
    this.readStringCharacteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_ABSTRACTTEXT_CHAR,
        function(error, data)
        {
            if(error)
            {
                return callback(error);
            }

            // 本来なら，ここにUTF-8 -> UTF-16 変換コードを追加しないといけない
            callback(null, data);
        }
    );
};

module.exports = SenStick2MetaDataReadoutService;