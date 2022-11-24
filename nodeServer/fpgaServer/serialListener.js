const { SerialPort } = require("serialport");


async function start(newMessage) {

    let portList = await SerialPort.list();
    let path = portList[0].path;
  
    const port = new SerialPort({ path: path, baudRate: 115200 });
  
    let data = "";
    let currentMessage = "";
    let lastMessage = "";
    let message = "";
    port.on("data", function (_data) {
      for (let char of _data.toString()) {
        if (char == "{") {
          data = "";
        }
        data += char;
        if (char == "}") {
          currentMessage = data;
        }
      }
      if (currentMessage != lastMessage) {
        lastMessage = currentMessage;
        message = currentMessage;
        let myJson = JSON.parse(message);
        for(let pin in myJson){
          myJson[pin] = Number(myJson[pin]);
        }
        newMessage(myJson);
      }
    });
  
    // Open errors will be emitted as an error event
    port.on("error", function (err) {
      console.log("Error: ", err.data);
    });
  }

  module.exports = { start}