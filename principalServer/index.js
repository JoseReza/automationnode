const { exec } = require("child_process");
const express = require("express");
const fs = require("fs");
const { platform } = require("os");
const dotenv = require("dotenv");
const deviceRouter = require("./deviceRouter");
const login = require("./login");

var app = express();
const port = 3000;
dotenv.config();

app.use(express.json());

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
  try {
    console.log(req.body);
    if (req.body.saveNewDevice == true) {
      //save new device
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
      req.body.return = true;
    }
    if (req.body.saveNewUser == true) {
      //save new user
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let _user of configurationJson.users) {
        if (_user.name == req.body.user.name) {
          res.send({ return: false, data: 0 });
          return;
        }
      }
      configurationJson.users.push(req.body.user);
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      req.body.return = true;
    }
    if (req.body.saveNewTemplate == true) {
      //save new template
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let _template of configurationJson.templates) {
        if (_template.name == req.body.template.name) {
          res.send({ return: false, data: 0 });
          return;
        }
      }
      configurationJson.templates.push({
        name: req.body.template.name,
        endpoint: req.body.template.name,
      });
      let templateBase = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="bootstrap.css" />
        <link rel="icon" href="./../icon.png" />
        <title>${req.body.template.name}</title>
      </head>
      <body>
      ${req.body.template.content}
      </body>
    </html>
    `;
      fs.writeFileSync(
        __dirname + "/public/templates/" + req.body.template.name + ".html",
        templateBase,
        { encoding: "utf-8" }
      );
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      req.body.return = true;
    }
  } catch (error) {
    console.error(error);
  }
  res.send(req.body);
});

app.delete("/data", login.check, async (req, res) => {
  console.log(req.body);
  try {
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
      req.body.return = true;
    }
    if (req.body.deleteTemplate == true) {
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.templates) {
        if (req.body.template.name == configurationJson.templates[index].name) {
          configurationJson.templates.splice(index, 1);
        }
      }
      fs.unlinkSync(
        __dirname + "/public/templates/" + req.body.template.name + ".html"
      );
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      req.body.return = true;
    }
    if (req.body.deleteUser == true) {
      let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for (let index in configurationJson.users) {
        if (req.body.user.name == configurationJson.users[index].name) {
          configurationJson.users.splice(index, 1);
        }
      }
      fs.writeFileSync(
        __dirname + "/configuration.json",
        JSON.stringify(configurationJson),
        { encoding: "utf-8" }
      );
      req.body.return = true;
    }
  } catch (error) {
    console.error(error);
  }
  res.send(req.body);
});

app = deviceRouter.start(app);
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  let configurationJson = JSON.parse(
    fs.readFileSync(__dirname + "/configuration.json", {
      encoding: "utf-8",
    })
  );
  if (platform() == "win32") {
    if (process.env.PRODUCTION == "true") {
      exec(
        `start msedge --kiosk http://localhost:${port} --edge-kiosk-type=fullscreen`
      );
    } else {
      exec(`start msedge http://localhost:${port}`);
    }
  }
  if (platform() == "linux") {
    if (process.env.PRODUCTION == "true") {
      exec(`chromium-browser http://localhost:${port} --kiosk`);
    } else {
      exec(`chromium-browser http://localhost:${port}`);
    }
  }
});
