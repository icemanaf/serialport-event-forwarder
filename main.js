const protobuf=require("protobufjs");
const kafka=require("kafka-node");
const path=require("path");
const config=require("./config");
const serialport=require("./serial");
const uuidv1=require("uuid/v1");
const fs=require('fs');




const proto_path=path.join(__dirname,"protos/KafkaMessage.proto");

protobuf.load(proto_path,function(err,root){
    if (err){
        throw err;
        
    }

    const kmType=root.lookupType("KafkaMessage");
    const msgType=kmType.lookup("MessageType");

    const kafkaClient=new kafka.KafkaClient({kafkaHost: config.kafka.broker});

    const producer=new kafka.Producer(kafkaClient);

    producer.on('ready',function(){
        console.log('connected to kafka broker');

        if (config.dump_test_file){

               /*
               message KafkaMessage{
                    string Id=1;
                    enum MessageType{
                        TEST=0;
                        ERROR=1;
                        EVENT=2;
                        COMMAND=3;
                    }
                    MessageType MsgType=2;
                    string Source=3;
                    int32 RetryCount=4;
                    string Payload=5;
                    string DatetimeCreatedUtc=6;
                }
               */  


            let msg={Id:uuidv1(),
                MsgType:msgType.values.EVENT,
                Source:'RF_SENSOR',
                RetryCount:5,
                Payload:"test data string",
                DatetimeCreatedUtc:"10th june 2019"};

                var err=kmType.verify(msg);

                if (err){
                    console.log('proto error verifying test dump message');
                }
                
                let km=kmType.fromObject(msg);


                let buffer=kmType.encode(km).finish();

                let km2=kmType.decode(buffer);

                fs.writeFileSync("test_dump_file",buffer);

                console.log("dumped test message.");
                return;
        }

        serialport.init(config.serial.port,config.serial.baudrate,function(data){

            let msg={Id:uuidv1(),
            MsgType:msgType.values.EVENT,
            Source:'RF_PIR_SENSOR',
            RetryCount:0,
            Payload:data,
            DatetimeCreatedUtc:new Date().toUTCString()};

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