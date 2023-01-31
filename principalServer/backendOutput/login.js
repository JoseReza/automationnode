"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const fs = require("fs");
function check(request, response, next) {
    //console.log("-->login.check", request.query);
    if (request.query.user) {
        let user = JSON.parse(request.query.user);
        let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
            encoding: "utf-8",
        }));
        let authenticated = false;
        for (let _user of configurationJson.users) {
            if (authenticated) {
                continue;
            }
            if (user.name == _user.name &&
                user.password == _user.password) {
                authenticated = true;
                if (user.authenticated) {
                    next();
                }
                else {
                    console.log("-->Authenticating user:", JSON.stringify(user));
                    console.log("-->User authenticated:", JSON.stringify(user));
                    user.authenticated = true;
                    if (_user.admin) {
                        _user.admin = undefined;
                        response.redirect(`/admin.html?user=${JSON.stringify(user)}`);
                    }
                    else {
                        _user.admin = undefined;
                        response.redirect(`/user.html?user=${JSON.stringify(user)}`);
                    }
                }
            }
        }
        if (!authenticated) {
            console.log("-->Rejected: User is not in configuration.json :", request.query);
            response.redirect(`/login.html`);
        }
    }
    else {
        console.log("-->Rejected: request.query has not been founded");
        response.redirect(`/login.html`);
    }
}
exports.check = check;
