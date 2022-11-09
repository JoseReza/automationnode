const fs = require("fs");

function check(req, res, next) {
  if (req.query.user) {
    let user = JSON.parse(req.query.user)
    let configurationJson = JSON.parse(
      fs.readFileSync(__dirname + "/configuration.json", {
        encoding: "utf-8",
      })
    );
    let authenticated = false;
    for (let _user of configurationJson.users) {
      if (authenticated) {
        continue;
      }
      if (
        user.name == _user.name &&
        user.password == _user.password
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
