const { SerialPort } = require("serialport");

export let readings = {};

export async function start( path = "COM3" ) {

  let portList = await SerialPort.list();
  console.log(portList);

  try {
    const port = new SerialPort({ path: path, baudRate: 115200 });

    let data = "";
    let currentMessage = "";
    let lastMessage = "";
    let message = "";
    port.on("data", function (_data: any) {
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
        console.log(currentMessage);
        lastMessage = currentMessage;
        message = currentMessage;
        let myJson: any = undefined;
        try {
          myJson = JSON.parse(message);
        } catch (error) {
          console.error(error);
        }
        for (let pin in myJson) {
          myJson[pin] = Number(myJson[pin]);
        }
        readings = myJson;
      }
    });

    // Open errors will be emitted as an error event
    port.on("error", function (err: any) {
      console.log("Error: ", err);
    });
  } catch (error) {
    console.log(error);
  }
}

