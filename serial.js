const SerialPort=require("serialport");

var serial={};

serial.init=function(port,baud,onDataCallback,onErrorCallback){
    const serialport=new SerialPort(port,{baudRate:baud})

    serialport.on("error",function(err){
            onErrorCallback(err);
    });
    
    let display_str="";

    serialport.on("data",function(data){
        for (let i=0;i<data.length;i++){
            let code=data[i];
            if (((code > 47 && code < 58) || (code > 64 && code < 91)))
            {
                    display_str+=String.fromCharCode(code);
                    
                    if (display_str.includes("AAAA") && display_str.includes("ZZZZ"))
                    {
                        onDataCallback(display_str);
                        display_str="";
                    }
                    if (display_str.includes("ZZZZ"))
                        display_str="";
            }
        }
    })


};

module.exports=serial;