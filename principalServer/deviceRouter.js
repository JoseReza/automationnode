const fetch = require("node-fetch");
const login = require("./login");
const time = require("./time");
const fs = require("fs");

function start(app){
  
  app.get("/camera", login.check, async (req, res) => {
    console.log("camera endpoint")
    if (req.query) {

        let device = JSON.parse(req.query.device);
        console.log("llega aqui -1")

        try{
          let data = undefined;
          let base64 = undefined;
          console.log("llega aqui 0")

          try {
            console.log("llega aqui 0.5")
            console.log("llega aqui 0.75")
            console.log("llega aqui 1")
            data = await fetch(`http://${device.direction}/capture`);
            console.log("llega aqui 2")
            data = await data.blob();
            console.log(data);
            console.log("llega aqui 3")
          } catch {
            console.error(`-->  ${device.direction} : Not listened`);
            res.send({ return: false, data: "Device not connected"});
            return;
          }
    
          console.log("llega aqui 4")

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
