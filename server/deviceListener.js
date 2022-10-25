const fetch = require("node-fetch");
const time = require("./time");
const fs = require("fs");

let intervalListenerDelay = 100;
let stop = false;
let deviceClasses = [];

class DeviceClass {

  listenig = false;
  name = "";
  protocol = "";
  direction = "";
  base64 = "";

  constructor(configuration){
    this.name = configuration.name;
    this.protocol = configuration.protocol;
    this.direction = configuration.direction;
  }

  async listen(){
    if(!this.listenig){

      this.listenig = true;
      let data = undefined;
      let base64 = this.base64;

      try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 1000);
        //console.log(`-->  ${this.direction} : Listening`);
        data = await fetch(`http://${this.direction}/capture`, {
          signal: controller.signal,
        });
        data = await data.blob();
      } catch {
        console.error(`-->  ${this.direction} : Not listened`);
      }

      try {
        data = Buffer.from(await data.arrayBuffer());
        console.log("-->arrayData:", data);
        data = data.toString("base64");
        base64 = "data:image/png;base64," + data;
      } catch (error) {
        //
      }
      this.base64 = base64;
      this.listenig = false;
    }
  }

}



async function startListener(devices) {

  stop = false;
  for (let configuration of devices) {
    let deviceInstance = new DeviceClass(configuration);
    deviceClasses.push(deviceInstance);

  }
  listenerLoop();

}

async function stopListener() {

  stop = true;
  await listenerLoop();
  for(let deviceClass of deviceClasses){
    delete deviceClass;
  }
  deviceClasses = [];

}

async function listenerLoop() {

  for(let deviceClass of deviceClasses){
    deviceClass.listen();
  }

  if (!stop) {
    await time.wait(intervalListenerDelay);
    await listenerLoop();
  }

}

function getDeviceCapture(name){
  for(let deviceClass of deviceClasses){
    if(deviceClass.name == name){
      return deviceClass.base64;
    }
  }
  return undefined;
}

module.exports = { startListener, stopListener, getDeviceCapture };
