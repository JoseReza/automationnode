const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

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
})

app.get("/streaming", function (req, res) {
  res.send({ response: 200 });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
