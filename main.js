const protobuf=require("protobufjs");
const kafka=require("kafka-node");
const path=require("path");
const config=require("./config");
const serialport=require("./serial");
const uuidv1=require("uuid/v1");




const proto_path=path.join(__dirname,"protos/KafkaMessage.proto");

protobuf.load(proto_path,function(err,root){
    if (err){
        throw err;
        
    }

    const kmType=root.lookupType("KafkaMessage");

    const kafkaClient=new kafka.KafkaClient({kafkaHost: config.kafka.broker});

    const producer=new kafka.Producer(kafkaClient);

    producer.on('ready',function(){
        console.log('connected to kafka broker');


        serialport.init(config.serial.port,config.serial.baudrate,function(data){

            let msg={id:uuidv1(),
            message_type:'EVENT',
            source:'RF_SENSOR',
            payload:data,
            datetime_created_utc:Date.now().toString()};

            var err=kmType.verify(msg);

            if (err){
                console.log('proto error verifying message');
            }

            console.log(msg);


            var buffer=kmType.encode(kmType.create(msg)).finish();

            let payload=[{topic:config.kafka.topic,messages:buffer}];

            producer.send(payload,function(data,err){
                
             });

        },function(err){
                console.log(err);
        });


       
        

    });

});