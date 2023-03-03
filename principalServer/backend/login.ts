import { user } from "./interfaces";

const fs = require("fs");

export function check(request: any, response: any, next: any) {
  console.log("-->login.check", request.query);
  if (request.query.user) {
    let user: user = JSON.parse(request.query.user) as user;
    let configurationJson = JSON.parse(
      fs.readFileSync(__dirname + "/../configuration.json", {
        encoding: "utf-8",
      })
    );

    let authenticated = false;
    for (let _user of configurationJson.users) {
      if (authenticated) {
        continue;
      }
      if (
        (user.name == _user.name || user.name == _user.email) &&
        (user.dynamicPassword == _user.dynamicPassword ||
          user.staticPassword == _user.staticPassword)
      ) {
        authenticated = true;
        if (user.authenticated) {
          next();
        } else {
          console.log("-->Authenticating user:", JSON.stringify(user));
          console.log("-->User authenticated:", JSON.stringify(user));
          user.authenticated = true;

          if (_user.admin) {
            _user.admin = undefined;
            user.id = _user.id;
            response.redirect(`/admin.html?user=${JSON.stringify(user)}`);
          } else {
            _user.admin = undefined;
            user.id = _user.id;
            response.redirect(`/user.html?user=${JSON.stringify(user)}`);
          }
        }
      }
    }

    if (!authenticated) {
      console.log(
        "-->Rejected: User is not in configuration.json :",
        request.query
      );
      response.redirect(`/login.html`);
    }
  } else {
    console.log("-->Rejected: request.query has not been founded");
    response.redirect(`/login.html`);
  }
}
