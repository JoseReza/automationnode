import * as customConsole from "./customConsole"
import * as childProcess from "child_process";
import * as dataRouter from "./dataRouter";
import * as events from "./events";
import * as email from "./email";
import * as login from "./login";
import * as dotenv from "dotenv";
import * as ngrok from "ngrok";
import fetch from "node-fetch";
import * as fs from "fs";
import * as os from "os";

import express from "express";
import { configuration, petition } from "./interfaces";

//Boot
express;
let app = express();
app.use(express.json());
dotenv.config();

//Get configuration json

let configurationJson: configuration = JSON.parse(
  fs.readFileSync(__dirname + "/../configuration.json", {
    encoding: "utf-8",
  })
);

//Update passwords

events.start(configurationJson.server.intervalUpdate);
email.start(configurationJson);

//Without login

app.get("/getConsole", (request: any, response: any) => {
  let content = customConsole.content;
  customConsole.clear();
  response.send({
    return: true,
    data: content
  });
});

app.get("/getTimestamp", (request: any, response: any) => {
  response.send({
    return: true,
    data: Date.now()
  });
});

app.get("/publicUrl", (request: any, response: any) => {
  let configurationJson = JSON.parse(
    fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8" })
  );
  response.send(configurationJson["ngrok"]["url"]);
});

app.get("/login.html", (request: any, response: any) => {
  response.send(
    fs.readFileSync(__dirname + "/../frontend/protected/login.html", {
      encoding: "utf-8",
    })
  );
});

//With login

app.get("/loginCheck", login.check, (request: any, response: any) => {
  response.send({ return: true });
});

app.get("/", login.check, (request: any, response: any) => {
  response.send(
    fs.readFileSync(__dirname + "/../protected/login.html", {
      encoding: "utf-8",
    })
  );
});

app.get("/configuration.json", login.check, (request: any, response: any) => {
  response.send(
    fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8" })
  );
});

app.post("/petition", login.check, async (request: any, response: any) => {
  console.log(request.body);
  try {
    let petition: petition = request.body.petition as petition;
    let response = await fetch(petition.url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petition.body),
      method: petition.method,
    });
    request.body.data = await response.text();
    request.body.return = true;
  } catch (error) {
    console.error(error);
    request.body.data = error;
    request.body.return = false;
  }

  console.log(request.body);
  response.send(request.body);
});

app = dataRouter.start(app);
app.use("/", express.static(__dirname + "/../frontend/unprotected")); //unprotected for assets
app
  .use(login.check)
  .use("/", express.static(__dirname + "/../frontend/protected")); //protected for html views

app.listen(Number(configurationJson["server"]["port"]), async () => {
  console.log(
    `Example app listening on port ${Number(
      configurationJson["server"]["port"]
    )}`
  );

  try {
    let ngrokUrl = await ngrok.connect({
      proto: "http",
      addr: Number(configurationJson["server"]["port"]),
      authtoken: process.env.authtoken,
    });
    configurationJson["ngrok"]["url"] = ngrokUrl;
    console.log("-->principalServer ngrokUrl:", ngrokUrl);
    fs.writeFileSync(
      `${__dirname}/../configuration.json`,
      JSON.stringify(configurationJson),
      { encoding: "utf-8" }
    );
  } catch (error) {
    console.error(error);
    console.log("-->Probably the ngrok authtoken is wrong or expired");
  }

  if (os.platform() == "win32") {
    if (
      configurationJson["server"]["showBrowser"] &&
      configurationJson["server"]["production"]
    ) {
      childProcess.exec(
        `start msedge --kiosk http://localhost:${Number(
          configurationJson["server"]["port"]
        )} --edge-kiosk-type=fullscreen`
      );
    } else if (
      configurationJson["server"]["showBrowser"] &&
      !configurationJson["server"]["production"]
    ) {
      childProcess.exec(
        `start msedge http://localhost:${Number(
          configurationJson["server"]["port"]
        )}`
      );
    }
  }
  if (os.platform() == "linux") {
    if (configurationJson["server"]["showBrowser"] && 
    configurationJson["server"]["production"]) {
      childProcess.exec(
        `chromium-browser http://localhost:${Number(
          configurationJson["server"]["port"]
        )} --kiosk`
      );
    } else if (
      configurationJson["server"]["showBrowser"] &&
      !configurationJson["server"]["production"]
    ) {
      childProcess.exec(
        `chromium-browser http://localhost:${Number(
          configurationJson["server"]["port"]
        )}`
      );
    }
  }
});
