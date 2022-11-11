const fetch = require("node-fetch");
const login = require("./login");
const time = require("./time");
const fs = require("fs");

function start(app){
  
  app.get("/camera", login.check, async (req, res) => {
    console.log("camera endpoint")
    if (req.query) {
        try{
          let device = JSON.parse(req.query.device);
          console.log(device);
          let data = undefined;
          let base64 = undefined;
    
          try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 1000);
            data = await fetch(`http://${device.direction}/capture`, {
              signal: controller.signal,
            });
            data = await data.blob();
          } catch {
            console.error(`-->  ${device.direction} : Not listened`);
            res.send({ return: false, data: "Device not connected"});
            return;
          }
    
          try {
            data = Buffer.from(await data.arrayBuffer());
            console.log("-->arrayData:", data);
            data = data.toString("base64");
            base64 = "data:image/png;base64," + data;
          } catch (error) {
            //console.error(error);
            res.send({ return: false, data: "Device not connected"});
            return
          }
      
          res.send({data: base64, return: true});
          return
        }catch{
          res.send({ return: false, data: "Device not connected"});
          return
        }
    }
  });

  return app;

}

module.exports = { start };
