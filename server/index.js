const { exec } = require("child_process");
const express = require("express");
const fs = require("fs");
const { platform } = require("os");
const dotenv = require("dotenv");
const deviceListener = require("./deviceListener");
const login = require("./login");

var app = express();
const port = 3000;
dotenv.config();

app.use(express.json());

function middleware(){

}

app.get("/", login.check, (req, res) => {
  res.send(
    fs.readFileSync(__dirname + "/public/index.html", { encoding: "utf-8" })
  );
});

app.get("/index.html", login.check, (req, res) => {
  res.send(
    fs.readFileSync(__dirname + "/public/index.html", { encoding: "utf-8" })
  );
});

app.get("/configuration.json", login.check, (req, res) => {
  res.send(
    fs.readFileSync(__dirname + "/configuration.json", { encoding: "utf-8" })
  );
});

app.put("/data", login.check, async (req, res) => {
  console.log(req.body);
  if (req.body.saveNewDevice == true) { //save new device
    let configurationJson = JSON.parse(
      fs.readFileSync(__dirname + "/configuration.json", {
        encoding: "utf-8",
      })
    );
    configurationJson.devices.push(req.body.device);
    fs.writeFileSync(
      __dirname + "/configuration.json",
      JSON.stringify(configurationJson),
      { encoding: "utf-8" }
    );
    await deviceListener.stopListener();
    await deviceListener.startListener(configurationJson.devices);
    req.body.return = true;
  }
  if (req.body.saveNewUser == true) { //save new user
    let configurationJson = JSON.parse(
      fs.readFileSync(__dirname + "/configuration.json", {
        encoding: "utf-8",
      })
    );
    configurationJson.users.push(req.body.user);
    fs.writeFileSync(
      __dirname + "/configuration.json",
      JSON.stringify(configurationJson),
      { encoding: "utf-8" }
    );
    req.body.return = true;
  }
  res.send(req.body);
});

app.delete("/data", login.check, async (req, res) => {
  console.log(req.body);
  if (req.body.deleteDevice == true) {
    let configurationJson = JSON.parse(
      fs.readFileSync(__dirname + "/configuration.json", {
        encoding: "utf-8",
      })
    );
    for (let index in configurationJson.devices) {
      if (req.body.device.name == configurationJson.devices[index].name) {
        configurationJson.devices.splice(index, 1);
      }
    }
    fs.writeFileSync(
      __dirname + "/configuration.json",
      JSON.stringify(configurationJson),
      { encoding: "utf-8" }
    );
    await deviceListener.stopListener();
    await deviceListener.startListener(configurationJson.devices);
    req.body.return = true;
  }
  res.send(req.body);
});

app.get("/capture", login.check, (req, res) => {
  if (req.query) {
    res.send(deviceListener.getDeviceCapture(req.query.deviceName));
  }
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  let configurationJson = JSON.parse(
    fs.readFileSync(__dirname + "/configuration.json", {
      encoding: "utf-8",
    })
  );
  console.log();
  deviceListener.startListener(configurationJson.devices);
  if(platform() == "win32"){
    exec(`start msedge --kiosk http://localhost:${port} --edge-kiosk-type=fullscreen`);
  }
  if(platform() == "linux"){
    if(process.env.PRODUCTION){
      exec(`chromium-browser http://localhost:${port} --kiosk`);
    }else{
      exec(`chromium-browser http://localhost:${port}`);
    }
  }
});