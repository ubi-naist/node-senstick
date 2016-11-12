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

/**
 * 加速度センサの測定レンジを表す定数．
 * @readonly
 * @enum {number}
 */
const AccelerometerMeasurementRange = {
    /** 2G */
    RANGE_2G: 0,
    /** 4G */
    RANGE_4G: 1,
    /** 8G */
    RANGE_8G: 2,
    /** 16G */
    RANGE_16G: 3
};

/**
 * 角速度センサの測定レンジを表す定数．
 * @readonly
 * @enum {number}
 */
const GyroscopeMeasurementRange = {
    /** 250DPS */
    RANGE_250DPS: 0,
    /** 500DPS */
    RANGE_500DPS: 1,
    /** 1000DPS */
    RANGE_1000DPS: 2,
    /** 2000DPS */
    RANGE_2000DPS: 3
};

/**
 * 磁気センサの測定レンジを表す定数．
 * @readonly
 * @enum {number}
 */
const MagneticFieldMeasurementRange = {
    /** 4915UT */
    RANGE_4915UT: 0
};

/**
 * 照度センサの測定レンジを表す定数．
 * @readonly
 * @enum {number}
 */
const IlluminanceMeasurementRange = {
    /** 65535LUX*/
    RANGE_65535LUX: 0
};

/**
 * 紫外線センサの測定レンジを表す定数．
 * @readonly
 * @enum {number}
 */
const UVMeasurementRange = {
    /**  */
    RANGE_13107UWPCM2: 0
};

/**
 * 
 */

module.exports = {
    ControlStatus: ControlStatus,
    InternalStorageErrorCode: InternalStorageErrorCode,
    SensorOperationMode: SensorOperationMode,
    AccelerometerMeasurementRange: AccelerometerMeasurementRange,
    GyroscopeMeasurementRange: GyroscopeMeasurementRange,
    MagneticFieldMeasurementRange: MagneticFieldMeasurementRange,
    IlluminanceMeasurementRange: IlluminanceMeasurementRange,
    UVMeasurementRange: UVMeasurementRange
};
