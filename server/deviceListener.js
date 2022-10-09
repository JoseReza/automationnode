const fetch = require("node-fetch");
const time = require("./time");
const fs = require("fs");

let intervalListenerDelay = 50;
let stop = false;
let deviceData = [];

async function startListener(devices) {
  stop = false;
  listenerLoop(devices);
}

function stopListener() {
  stop = true;
}

async function listenerLoop(devices) {
  
  let newDeviceData = [];

  for (let device of devices) {
    let data = undefined;
    if (device.protocol == "tcp/ip") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        data = await fetch(`http://${device.direction}/capture`, {
          signal: controller.signal,
        });
        data = await data.blob();
      } catch {
        console.error(`-->Not listened: ${JSON.stringify(device)}`);
      }
    }

    let base64 = "";

    try {
      data = Buffer.from(await data.arrayBuffer());
      data = data.toString("base64");
      base64 = "data:image/png;base64," + data;

      newDeviceData.push({
        ...device,
        base64,
      });

      deviceData = newDeviceData;

    } catch (error) {
      console.error(error);
    }
  }

  

  if (!stop) {
    await time.wait(intervalListenerDelay);
    await listenerLoop(devices);
  }
}

function getDeviceData(){
  return deviceData;
}

module.exports = { startListener, stopListener, getDeviceData };
