const deviceRouter = require("./deviceRouter");
const childProcess = require("child_process");
const express = require("express");
const login = require("./login");
const dotenv = require("dotenv");
const ngrok = require("ngrok");
const fs = require("fs");
const os = require("os");

var app = express();
dotenv.config();
app.use(express.json());

let configurationJson = require("./configuration");
configurationJson = JSON.parse(
  fs.readFileSync(__dirname + "/configuration.json", {
    encoding: "utf-8",
  })
);

app.get("/publicUrl", (request, response) => {
  console.log("publicUrl");
  let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/configuration.json", { encoding: "utf-8" }));
  response.send(
    configurationJson["ngrok"]["url"]
  );
});

app.get("/", login.check, (request, response) => {
  response.send(
    fs.readFileSync(__dirname + "/public/index.html", { encoding: "utf-8" })
  );
});

app.get("/index.html", login.check, (request, response) => {
  response.send(
    fs.readFileSync(__dirname + "/public/index.html", { encoding: "utf-8" })
  );
});

app.get("/configuration.json", login.check, (request, response) => {
  response.send(
    fs.readFileSync(__dirname + "/configuration.json", { encoding: "utf-8" })
  );
});

app.put("/data", login.check, async (request, response) => {
  try {
    console.log(request.body);
    if (request.body.saveNewDevice == true) {
      //save new device
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      configurationJson.devices.push(request.body.device);
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
    if (request.body.saveNewUser == true) {
      //save new user
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let _user of configurationJson.users) {
        if (_user.name == request.body.user.name) {
          response.send({ return: false, data: 0 });
          return;
        }
      }
      configurationJson.users.push(request.body.user);
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
    if (request.body.saveNewTemplate == true) {
      //save new template
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let _template of configurationJson.templates) {
        if (_template.name == request.body.template.name) {
          response.send({ return: false, data: 0 });
          return;
        }
      }
      configurationJson.templates.push({
        name: request.body.template.name,
        endpoint: request.body.template.name,
      });
      fs.writeFileSync(
        __dirname +
          "/public/templates/" +
          request.body.template.name +
          ".content.html",
        request.body.template.content,
        { encoding: "utf-8" }
      );
      let templateBase = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="./../bootstrap.css" />
        <link rel="icon" href="./../icon.png" />
        <title>${request.body.template.name}</title>
      </head>
      <body>
      ${request.body.template.content}
      </body>
    </html>
    `;
      fs.writeFileSync(
        __dirname + "/public/templates/" + request.body.template.name + ".html",
        templateBase,
        { encoding: "utf-8" }
      );
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
  } catch (error) {
    console.error(error);
  }
  response.send(request.body);
});

app.post("/data", login.check, async (request, response) => {
  try {
    console.log(request.body);
    if (request.body.updateDevice == true) {
      //update device
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.devices) {
        if (request.body.device.name == configurationJson.devices[index].name) {
          configurationJson.devices.splice(index, 1);
          configurationJson.devices.push(request.body.device);
        }
      }
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
    if (request.body.updateUser == true) {
      //update user
    }
    if (request.body.updateTemplate == true) {
      //update template
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.templates) {
        if (
          request.body.template.name == configurationJson.templates[index].name
        ) {
          configurationJson.templates.splice(index, 1);
          configurationJson.templates.push(request.body.template);
        }
      }
      fs.writeFileSync(
        __dirname +
          "/public/templates/" +
          request.body.template.name +
          ".content.html",
        request.body.content,
        { encoding: "utf-8" }
      );
      let templateBase = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="./../bootstrap.css" />
          <link rel="icon" href="./../icon.png" />
          <title>${request.body.template.name}</title>
        </head>
        <body>
        ${request.body.content}
        </body>
      </html>
      `;
      fs.writeFileSync(
        __dirname + "/public/templates/" + request.body.template.name + ".html",
        templateBase,
        { encoding: "utf-8" }
      );
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
  } catch (error) {
    console.error(error);
  }
  response.send(request.body);
});

app.delete("/data", login.check, async (request, response) => {
  console.log(request.body);
  try {
    if (request.body.deleteDevice == true) {
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.devices) {
        if (request.body.device.name == configurationJson.devices[index].name) {
          configurationJson.devices.splice(index, 1);
        }
      }
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
    if (request.body.deleteTemplate == true) {
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.templates) {
        if (
          request.body.template.name == configurationJson.templates[index].name
        ) {
          configurationJson.templates.splice(index, 1);
        }
      }
      fs.unlinkSync(
        __dirname + "/public/templates/" + request.body.template.name + ".html"
      );
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
    if (request.body.deleteUser == true) {
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.users) {
        if (request.body.user.name == configurationJson.users[index].name) {
          configurationJson.users.splice(index, 1);
        }
      }
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      request.body.return = true;
    }
  } catch (error) {
    console.error(error);
  }
  response.send(request.body);
});

app = deviceRouter.start(app);
app.use(express.static("public"));

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
    console.log("ngrokUrl: ", ngrokUrl);
    fs.writeFileSync(`${__dirname}/configuration.json`, JSON.stringify(configurationJson), {encoding: "utf-8"});
  } catch (error) {
    console.error(error);
    console.log("-->Probably the ngrok authtoken is wrong or expired");
  }


  if (os.platform() == "win32") {
    if (
      configurationJson["server"]["showBrowser"] == true &&
      configurationJson["server"]["production"] == true
    ) {
      childProcess.exec(
        `start msedge --kiosk http://localhost:${Number(
          configurationJson["server"]["port"]
        )} --edge-kiosk-type=fullscreen`
      );
    } else if (
      configurationJson["server"]["showBrowser"] == true &&
      configurationJson["server"]["production"] == false
    ) {
      childProcess.exec(
        `start msedge http://localhost:${Number(
          configurationJson["server"]["port"]
        )}`
      );
    }
  }
  if (os.platform() == "linux") {
    if (configurationJson["server"]["showBrowser"] == true) {
      childProcess.exec(
        `chromium-browser http://localhost:${Number(
          configurationJson["server"]["port"]
        )} --kiosk`
      );
    } else if (
      configurationJson["server"]["showBrowser"] == true &&
      configurationJson["server"]["production"] == false
    ) {
      childProcess.exec(
        `chromium-browser http://localhost:${Number(
          configurationJson["server"]["port"]
        )}`
      );
    }
  }
});
