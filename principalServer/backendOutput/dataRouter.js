"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const login = __importStar(require("./login"));
const fs = __importStar(require("fs"));
function start(app) {
    app.put("/data", login.check, (request, response) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(request.body);
            if (request.body.saveNewDevice == true) {
                //save new device
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                configurationJson.devices.push(request.body.device);
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
            if (request.body.saveNewUser == true) {
                //save new user
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let _user of configurationJson.users) {
                    if (_user.name == request.body.user.name) {
                        response.send({ return: false, data: 0 });
                        return;
                    }
                }
                configurationJson.users.push(request.body.user);
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
            if (request.body.saveNewTemplate == true) {
                //save new template
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let _template of configurationJson.templates) {
                    if (_template.name == request.body.template.name) {
                        response.send({ return: false, data: 0 });
                        return;
                    }
                }
                configurationJson.templates.push({
                    name: request.body.template.name,
                    endpoint: request.body.template.name,
                });
                fs.writeFileSync(__dirname +
                    "/public/templates/" +
                    request.body.template.name +
                    ".content.html", request.body.template.content, { encoding: "utf-8" });
                let templateBase = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" href="./../bootstrap.css" />
              <link rel="icon" href="./../icon.png" />
              <title>${request.body.template.name}</title>
            </head>
            <body>
            ${request.body.template.content}
            </body>
          </html>
          `;
                fs.writeFileSync(__dirname + "/public/templates/" + request.body.template.name + ".html", templateBase, { encoding: "utf-8" });
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
        }
        catch (error) {
            console.error(error);
        }
        response.send(request.body);
    }));
    app.post("/data", login.check, (request, response) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(request.body);
            if (request.body.updateDevice == true) {
                //update device
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let index in configurationJson.devices) {
                    if (request.body.device.name == configurationJson.devices[index].name) {
                        configurationJson.devices.splice(index, 1);
                        configurationJson.devices.push(request.body.device);
                    }
                }
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
            if (request.body.updateUser == true) {
                //update user
            }
            if (request.body.updateTemplate == true) {
                //update template
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let index in configurationJson.templates) {
                    if (request.body.template.name == configurationJson.templates[index].name) {
                        configurationJson.templates.splice(index, 1);
                        configurationJson.templates.push(request.body.template);
                    }
                }
                fs.writeFileSync(__dirname +
                    "/public/templates/" +
                    request.body.template.name +
                    ".content.html", request.body.content, { encoding: "utf-8" });
                let templateBase = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="./../bootstrap.css" />
                <link rel="icon" href="./../icon.png" />
                <title>${request.body.template.name}</title>
              </head>
              <body>
              ${request.body.content}
              </body>
            </html>
            `;
                fs.writeFileSync(__dirname + "/public/templates/" + request.body.template.name + ".html", templateBase, { encoding: "utf-8" });
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
        }
        catch (error) {
            console.error(error);
        }
        response.send(request.body);
    }));
    app.delete("/data", login.check, (request, response) => __awaiter(this, void 0, void 0, function* () {
        console.log(request.body);
        try {
            if (request.body.deleteDevice == true) {
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let index in configurationJson.devices) {
                    if (request.body.device.name == configurationJson.devices[index].name) {
                        configurationJson.devices.splice(index, 1);
                    }
                }
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
            if (request.body.deleteTemplate == true) {
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let index in configurationJson.templates) {
                    if (request.body.template.name == configurationJson.templates[index].name) {
                        configurationJson.templates.splice(index, 1);
                    }
                }
                fs.unlinkSync(__dirname + "/public/templates/" + request.body.template.name + ".html");
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
            if (request.body.deleteUser == true) {
                let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
                    encoding: "utf-8",
                }));
                for (let index in configurationJson.users) {
                    if (request.body.user.name == configurationJson.users[index].name) {
                        configurationJson.users.splice(index, 1);
                    }
                }
                fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
                request.body.return = true;
            }
        }
        catch (error) {
            console.error(error);
        }
        response.send(request.body);
    }));
    return app;
}
exports.start = start;
