const serialListener = require("./serialListener");
const childProcess = require("child_process");
const express = require("express");
const os = require("os");
const ip = require("ip");

import * as dotenv from "dotenv";
import * as ngrok from "ngrok";

dotenv.config();
let app = express();

app.use(express.static("public"));
app.use(express.json());

async function start() {
  ngrok.authtoken(String(process.env.authtoken));
  let ngrokForFpgaIde = await ngrok.connect(Number(process.env.fpga_ide_port));
  console.log("-->FpgaServer ngrokUrl:", ngrokForFpgaIde);

  await serialListener.start();

  app.post("/data", async (request: any, response: any) => {
    console.log(request.body);
    request.body.return = false;
    if (request.body.getReadings == true) {
      request.body.data = serialListener.readings;
      request.body.return = true;
    }
    if (request.body.getNetwork == true) {
      request.body.data = {
        ip: ip.address(),
        port: process.env.port,
      };
      request.body.return = true;
    }
    if (request.body.getPublicUrl == true) {
      request.body.data = ngrokForFpgaIde;
      request.body.return = true;
    }
    response.send(request.body);
  });

  app.listen(process.env.port, function () {
    console.log("Server is ready on port: ", process.env.port);
    if (os.platform() == "win32") {
      if (process.env.production == "true") {
        childProcess.exec(
          `start msedge --kiosk http://localhost:${Number(
            process.env.port
          )} --edge-kiosk-type=fullscreen`
        );
      } else {
        childProcess.exec(
          `start msedge http://localhost:${Number(process.env.port)}`
        );
      }
    }
    if (os.platform() == "linux") {
      if (process.env.production == "true") {
        childProcess.exec(
          `chromium-browser http://localhost:${Number(
            process.env.port
          )} --kiosk`
        );
      } else {
        childProcess.exec(
          `chromium-browser http://localhost:${Number(process.env.port)}`
        );
      }
    }
  });
}
start();
