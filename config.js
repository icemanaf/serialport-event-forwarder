var config={};

config.kafka={};
config.serial={};


config.kafka.broker=process.env.KAFKA_BROKER|| "192.168.0.85:9092";
config.kafka.topic=process.env.KAFKA_TOPIC||"PIR_DETECT";

config.serial.port=process.env.SERIAL_PORT || "COM3";
config.serial.baudrate=process.env.BAUD || 596;

module.exports=config;