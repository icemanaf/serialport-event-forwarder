# IOT sensor data forwarder.

This application forwards on data received by a cheap 433Mhz RF module into a kafka broker.

The docker image is meant to be run on any flavour of a rasperry pi which has docker support and  networking setup. This is to access and forward on the events to the Kafka broker.

The cheap 433Mhz receiver is directly powered by the PI and the receiver output is connected directly to the pi's serial RX input.

In my application I used a rpi zero W. There is no need to use manchester encoding as such or any esetoric methods of packaging the data, I used a low baud rate of 600 which was more than adequate for this application where only a few simple message types are forwarded on.

These are essentially acknowledgment messages which are passed on at regular intervals to signify that the device is alive and working, or the actually event message which depending on the device could be a temperature reading or a detection message if it is a PIR sensor for example.

once the receiver module has been setup and is verified that is sending data correctly, do the following.

`docker run -it -e BAUD=600 -e SERIAL_PORT=/dev/ttyAMA0 --device=/dev/ttyAMA0 --restart=always icemanaf/serialport-event-forwarder