const serialListener = require("./serialListener");
const express = require("express");
const ngrok = require("ngrok");
const fs = require("fs");

let app = express();
app.use(express.json());

async function start() {

  let configurationJson = JSON.parse(fs.readFileSync(`${__dirname}/configuration.json`, { encoding: "utf-8"}));
  ngrok.authtoken(configurationJson["ngrok"]["authtoken"]);

  let ngrokForFpgaIde = await ngrok.connect(configurationJson["fpga"]["ide"]["port"]);

  await serialListener.start();

  app.post("/data", async (request, response) => {
    console.log(request.body);
    request.body.return = false;
    if(request.body.getReadings == true){
      request.body.data = serialListener.readings;
      request.body.return = true;
    }
    if(request.body.getIdeUrl == true){
      request.body.data = ngrokForFpgaIde;
      request.body.return = true;
    }
    response.send(request.body);
  });


  app.listen(configurationJson["server"]["port"], function () {
    console.log("Server is ready on port: ", configurationJson["server"]["port"]);
  });

}
start();