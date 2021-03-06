var config={};

config.kafka={};
config.serial={};


config.kafka.broker=process.env.KAFKA_BROKER|| "192.168.0.85:9092";
config.kafka.topic=process.env.KAFKA_TOPIC||"PIR_DETECT";

if (process.env.BAUD){
    config.serial.baudrate=parseInt(process.env.BAUD);
}else{
    config.serial.baudrate=600;
}

config.serial.port=process.env.SERIAL_PORT || "COM3";

config.dump_test_file=false;


module.exports=config;