/**
 * @fileOverview 定数を宣言するファイルです．
 * @author Masashi Fujiwara
 */
'use strict';

/**
 * SenStickの動作状態を示す定数．
 * @readonly
 * @enum {number}
 */
const ControlStatus = {
    /** センシングおよびロギング停止 */
    STOP_LOGGING_AND_SENSING : 0x00,
    /** センシングおよびロギング動作 */
    RUN_LOGING_AND_SENSING : 0x01,
    /** ストレージフォーマット */
    FORMAT_STORAGE : 0x10,
    /** ディープスリープモード */
    DEEP_SLEEP : 0x20,
    /** DFUモード */
    DFU_MODE : 0x40
};

/**
 * 内部ストレージのステート情報を示す定数．
 * @readonly
 * @enum {number}
 */
const InternalStorageErrorCode = {
    /** 正常動作 */
    OK : 0x00,
    /** ストレージフルまたは記録不可能状態 */
    STORAGE_FAULT : 0x01
};

/**
 * センサの動作モードを示す定数．
 * @readonly
 * @enum {number}
 */
const SensorOperationMode = {
    /** 停止(無効) */
    DISABLE: 0x00,
    /** センシング */
    SENSING: 0x01,
    /** センシングおよびロギング */
    SENSING_AND_LOGGING: 0x03
};

module.exports = {
    ControlStatus: ControlStatus,
    InternalStorageErrorCode: InternalStorageErrorCode,
    SensorOperationMode: SensorOperationMode
};
