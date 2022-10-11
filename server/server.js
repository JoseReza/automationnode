const express = require("express");
const fs = require("fs");
const deviceListener = require("./deviceListener");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/public/configuration.json", { encoding: "utf-8" }));
deviceListener.startListener(configurationJson.devices);

app.get("/", function (req, res) {
  res.send(
    fs.readFileSync(__dirname + "/public/index.html", { encoding: "utf-8" })
  );
});

app.put("/data", function(req, res){
  console.log(req.body);
  if(req.body.saveNewDevice == true){
    let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/public/configuration.json", { encoding: "utf-8" }));
    configurationJson.devices.push(req.body.device);
    fs.writeFileSync(__dirname + "/public/configuration.json", JSON.stringify(configurationJson), {encoding: "utf-8"});
    req.body.return = true;
  }
  res.send(req.body);
});

app.delete("/data", function(req, res){
  console.log(req.body);
  if(req.body.deleteDevice == true){
    let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/public/configuration.json", { encoding: "utf-8" }));
    for(let index in configurationJson.devices){
      if(req.body.device.name == configurationJson.devices[index].name){
        configurationJson.devices.splice(index,1);
      }
    }
    fs.writeFileSync(__dirname + "/public/configuration.json", JSON.stringify(configurationJson), {encoding: "utf-8"});
    req.body.return = true;
  }
  res.send(req.body);
});

app.get("/capture", function (req, res) {
  console.log(req.query);
  if(req.query){
    for(let deviceData of deviceListener.getDeviceData()){
      console.log(deviceData);
      if(deviceData.name == req.query.name){
        res.send(deviceData.base64);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
