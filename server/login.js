const fs = require("fs");

function check(req, res, next) {
  console.log(req.query);
  if (req.query.name != undefined && req.query.password != undefined) {
    let configurationJson = JSON.parse(
        fs.readFileSync(__dirname + "/configuration.json", {
          encoding: "utf-8",
        })
      );
      for(let user of configurationJson.users){
          if(req.query.name == user.name && req.query.password == btoa(user.password)){
              console.log("-->Logged: ", user.name);
              next();
        }
      }
  }else{
      console.log("-->Rejected: ", req.query.name);
      res.send(
        fs.readFileSync(__dirname + "/public/login.html", { encoding: "utf-8" })
      );
  }

}

module.exports = { check };
