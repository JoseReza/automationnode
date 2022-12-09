const serialListener = require("./serialListener");
const childProcess = require("child_process");
const express = require("express");
const ngrok = require("ngrok");
const os = require("os");
const fs = require("fs");
const ip = require("ip");

let app = express();

app.use(express.static("public"));
app.use(express.json());

async function start() {
  let configurationJson = JSON.parse(
    fs.readFileSync(`${__dirname}/configuration.json`, { encoding: "utf-8" })
  );

  /*
  ngrok.authtoken(configurationJson["ngrok"]["authtoken"]);

  let ngrokForFpgaIde = await ngrok.connect(
    configurationJson["fpga"]["ide"]["port"]
  );
    */


  await serialListener.start();

  app.post("/data", async (request, response) => {
    console.log(request.body);
    request.body.return = false;
    if (request.body.getReadings == true) {
      request.body.data = serialListener.readings;
      request.body.return = true;
    }
    if (request.body.getNetwork == true) {
      request.body.data = {
        ip: ip.address(),
        port: configurationJson["server"]["port"]
      }
      request.body.return = true;
    }
    if (request.body.getIdeUrl == true) {
      request.body.data = ngrokForFpgaIde;
      request.body.return = true;
    }
    response.send(request.body);
  });

  app.listen(configurationJson["server"]["port"], function () {
    console.log(
      "Server is ready on port: ",
      configurationJson["server"]["port"]
    );
    if (os.platform() == "win32") {
      if (process.env.PRODUCTION == "true") {
        childProcess.exec(
          `start msedge --kiosk http://localhost:${Number(
            configurationJson["server"]["port"]
          )} --edge-kiosk-type=fullscreen`
        );
      } else {
        childProcess.exec(
          `start msedge http://localhost:${Number(
            configurationJson["server"]["port"]
          )}`
        );
      }
    }
    if (os.platform() == "linux") {
      if (process.env.PRODUCTION == "true") {
        childProcess.exec(
          `chromium-browser http://localhost:${Number(
            configurationJson["server"]["port"]
          )} --kiosk`
        );
      } else {
        childProcess.exec(
          `chromium-browser http://localhost:${Number(
            configurationJson["server"]["port"]
          )}`
        );
      }
    }
  });
}
start();
