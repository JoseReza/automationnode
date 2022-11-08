const fs = require("fs");

function check(req, res, next) {
  
  if (req.query.name != undefined && req.query.password != undefined) {
    let configurationJson = JSON.parse(
      fs.readFileSync(__dirname + "/configuration.json", {
        encoding: "utf-8",
      })
    );
    let authenticated = false;
    for (let user of configurationJson.users) {
      if (authenticated) {
        continue;
      }
      if (
        req.query.name == user.name &&
        req.query.password == user.password
      ) {
        authenticated = true;
        next();
      }
    }

    if (!authenticated) {
      console.log("-->Rejected: ", req.query.name);
      res.send(
        fs.readFileSync(__dirname + "/public/login.html", { encoding: "utf-8" })
      );
    }
  } else {
    console.log("-->Rejected: ", req.query.name);
    res.send(
      fs.readFileSync(__dirname + "/public/login.html", { encoding: "utf-8" })
    );
  }
}

module.exports = { check };
