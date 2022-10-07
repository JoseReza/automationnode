const fetch = require("node-fetch");
const time = require("./time");

let intervalListenerDelay = 500;
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
  console.log(`-->Listening: ${JSON.stringify(devices)}`);

  for (let device of devices) {
    let data = undefined;
    if (device.protocol == "tcp/ip") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        data = await fetch(`http://${device.direction}/capture`, {
          signal: controller.signal,
        });
        data = await data.text();
      } catch {
        console.error(`-->Not listened: ${JSON.stringify(device)}`);
      }
    }

    newDeviceData.push({
      ...device,
      data,
    });

    console.log(data);
  }

  deviceData = newDeviceData;

  if (!stop) {
    await listenerLoop(devices);
  }

  await time.wait(1000);
}

module.exports = { startListener, stopListener, deviceData };
