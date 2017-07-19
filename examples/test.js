// example program

var async = require('async');
var SenStick = require('../index.js');

SenStick.discover(
    function(senstick)
    {
        console.log('discovered : ' + senstick);
        var logdata_readout_finished = false;

        senstick.on(
            'disconnect',
            function()
            {
                console.log('we got disconnected!');
                console.log('bye bye');
                process.exit();
            }
        );

        senstick.on(
            'illuminanceChange',
            function(value)
            {
                console.log('update illuminance: ' + value);
            }
        );
        
        senstick.on(
            'illuminanceLogDataReceived',
            function(number_of_data, sensor_data)
            {
                if(number_of_data <= 0) logdata_readout_finished = true;
                else
                {
                    console.log('number_of_data = ' + number_of_data);
                    console.log('sensor_data = ' + sensor_data);
                }
            }
        );

        async.series([
            function(callback)
            {
                console.log('connectAndSetUp');
                senstick.connectAndSetUp(callback);
            },
            function(callback)
            {
                console.log('readDeviceName');
                senstick.readDeviceName(function(error, deviceName) {
                    console.log('\tdevice name = ' + deviceName);
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            function(callback)
            {
                console.log('readSystemId');
                senstick.readSystemId(function(error, systemID) {
                    console.log('\tsystem id = ' + systemID);
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            function(callback)
            {
                console.log('readSerialNumber');
                senstick.readSerialNumber(function(error, serialNumber) {
                    console.log('\tserial number = ' + serialNumber);
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            function(callback)
            {
                console.log('readFirmwareRevision');
                senstick.readFirmwareRevision(function(error, firmwareRevision) {
                    console.log('\tfirmware revision = ' + firmwareRevision);
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            function(callback)
            {
                console.log('readHardwareRevision');
                senstick.readHardwareRevision(function(error, hardwareRevision) {
                    console.log('\thardware revision = ' + hardwareRevision);
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            function(callback)
            {
                console.log('readSoftwareRevision');
                senstick.readSoftwareRevision(function(error, softwareRevision) {
                    console.log('\tsoftware revision = ' + softwareRevision);
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            function(callback)
            {
                console.log('readManufacturerName');
                senstick.readManufacturerName(function(error, manufacturerName) {
                    console.log('\tmanufacturer name = ' + manufacturerName);
                    console.log('\terror = ' + error);
                    callback();
                });
            },

            // BatteryLevelチェック用
            function(callback)
            {
                console.log('readBatteryLevel');
                senstick.readBatteryLevel(function(error, value) {
                    console.log('\tlevel = ' + value + '%');
                    console.log('\terror = ' + error);
                    callback();
                });
            },
            // 以下Metadataチェック用
            function(callback)
            {
                console.log('writeTargetLogId');
                senstick.writeTargetLogId(
                    2,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readTargetLogId');
                senstick.readTargetLogId(
                    function(error, log_id)
                    {
                        console.log('\tlog_id = ' + log_id);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readLogLoggingStartedTimeFromTargetLog');
                senstick.readLogLoggingStartedTimeFromTargetLog(
                    function(error, datetime)
                    {
                        console.log('\tstarted time = ' + datetime);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readLogAbstractTextFromTargetLog');
                senstick.readLogAbstractTextFromTargetLog(
                    function(error, abstract_text)
                    {
                        console.log('\tabstract text = ' + abstract_text);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },

            // SenStickControl
            function(callback)
            {
                console.log('readControlStatus');
                senstick.readControlStatus(
                    function(error, status)
                    {
                        console.log('\tstatus = ' + status);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readActiveLogNum');
                senstick.readActiveLogNum(
                    function(error, active_log_num)
                    {
                        console.log('\tactive_log_num = ' + active_log_num);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readInternalStorageState');
                senstick.readInternalStorageState(
                    function(error, storage_error_code)
                    {
                        console.log('\tstorage_error_code = ' + storage_error_code);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('writeInternalDatetime');
                var date = new Date();
                senstick.writeInternalDatetime(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },     
            function(callback)
            {
                console.log('readInternalDatetime');
                senstick.readInternalDatetime(
                    function(error, datetime)
                    {
                        console.log('\tdatetime = ' + datetime);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },

            // 照度センサ
            function(callback)
            {
                console.log('readIlluminanceMeasurementConfig');
                senstick.readIlluminanceMeasurementConfig(
                    function(error, operation_mode, sampling_period, measurement_range)
                    {
                        console.log('\toperation_mode    = ' + operation_mode);
                        console.log('\tsampling_period   = ' + sampling_period);
                        console.log('\tmeasurement_range = ' + measurement_range);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            /*function(callback)
            {
                console.log('writeIlluminanceSamplingPeriod');
                senstick.writeIlluminanceSamplingPeriod(
                    1000,
                    function(error)
                    {
                        console.log('\terror = error');
                        callback();
                    }
                );
            },*/
            function(callback)
            {
                console.log('enableIlluminanceSensor');
                senstick.enableIlluminanceSensor(
                    true,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyIlluminance');
                senstick.notifyIlluminance(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('start logging');
                senstick.startSensingAndLogging(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('wait a minute');
                setTimeout(callback, 5000);
            },
            function(callback)
            {
                console.log('stop logging');
                senstick.stopSensingAndLogging(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('unnotifyIlluminance');
                senstick.unnotifyIlluminance(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readIlluminanceLogData');
                senstick.readIlluminanceLogData(
                    14,
                    0,
                    function(error, log_metadata, log_data)
                    {
                        console.log('\tlog_metadata = ' + log_metadata);
                        console.log('\tlog_data = ' + log_data);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('writeIlluminanceLogReadoutTargetID');
                senstick.writeIlluminanceLogReadoutTargetID(
                    15,
                    0,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('readIlluminanceLogMetaData');
                senstick.readIlluminanceLogMetaData(
                    function(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)
                    {
                        console.log('\ttarget_log_id = ' + target_log_id);
                        console.log('\tsampling_period = ' + sampling_period);
                        console.log('\tmeasurement_range = ' + measurement_range);
                        console.log('\tnumber_of_samples = ' + number_of_samples);
                        console.log('\treading_position = ' + reading_position);
                        console.log('\tremaining_storage = ' + remaining_storage);
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('notifyIlluminanceLogData');
                senstick.notifyIlluminanceLogData(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('writeIlluminanceLogReadoutTargetID');
                senstick.writeIlluminanceLogReadoutTargetID(
                    14,
                    0,
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            function(callback)
            {
                console.log('wait for finish readout illuminance log data');
                while(!logdata_readout_finished) {}
                callback();
            },
            function(callback)
            {
                console.log('unnotifyIlluminanceLogData');
                senstick.unnotifyIlluminanceLogData(
                    function(error)
                    {
                        console.log('\terror = ' + error);
                        callback();
                    }
                );
            },
            // 接続終わり！
            function(callback)
            {
                console.log('disconnect');
                senstick.disconnect(callback);
            }
        ]);
    }
);
