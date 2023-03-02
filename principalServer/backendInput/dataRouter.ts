import * as express from "express";
import * as login from "./login";
import * as fs from "fs";
import { configuration, device, template, user } from "./interfaces";
import * as password from "./password";

export function start(app: any): any{
    app.put("/data", login.check, async (request: any, response: any) => {
        try {
          console.log(request.body);
          if (request.body.saveNewDevice == true) {
            //save new device
            let device: device = request.body.device as device;
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            let ids: number[] = [0];
            for(let device of configurationJson.devices){
              ids.push(device.id);
            }
            device.id = Math.max(...ids) + 1;
            configurationJson.devices.push(device);
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.saveNewUser == true) {
            //save new user
            let user: user = request.body.user as user;
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let _user of configurationJson.users) {
              if (_user.name == request.body.user.name) {
                response.send({ return: false, data: 0 });
                return;
              }
            }
            let ids: number[] = [0];
            for(let user of configurationJson.users){
              ids.push(user.id);
            }
            console.log("-->user:", user)
            user.templates = [];
            user.id = Math.max(...ids) + 1;
            user.dynamicPassword = password.generateNewPassword();
            configurationJson.users.push(user);
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.saveNewTemplate == true) {
            //save new template
            let template: template = {
              id: 0,
              name: "",
              endpoint: ""
            };
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let _template of configurationJson.templates) {
              if (_template.id == request.body.template.id || _template.name == request.body.template.name) {
                response.send({ return: false, data: 0 });
                return;
              }
            }
            let ids: number[] = [0];
            for(let template of configurationJson.templates){
              ids.push(template.id);
            }
            template.id = Math.max(...ids) + 1;
            template.name = request.body.template.name;
            template.endpoint = request.body.template.name;
            configurationJson.templates.push(template);

            let templateBase = fs.readFileSync(__dirname + "/../frontend/protected/templateBase.html", {encoding:"utf-8"});

            let titleSeparator = templateBase.split("<title>");
            titleSeparator.splice(1, 0, "<title>" + request.body.template.name);
            templateBase = "";
            for(let element of titleSeparator)
              templateBase+=element;

            let bodySeparator = templateBase.split("<body>");
            bodySeparator.splice(1, 0, "<body>" + request.body.template.content);
            templateBase = "";
            for(let element of bodySeparator)
              templateBase+=element;
            
            fs.writeFileSync(
              __dirname + "/../frontend/protected/templates/" + template.name + ".html",
              templateBase,
              { encoding: "utf-8" }
            );

            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
        } catch (error) {
          console.error(error);
        }
        console.log(request.body);
        response.send(request.body);
      });
      
      app.post("/data", login.check, async (request: any, response: any) => {
        try {
          console.log(request.body);
          if (request.body.updateDevice == true) {
            //update device
            let device: device = request.body.device as device;
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let index in configurationJson.devices) {
              if (device.id == configurationJson.devices[index].id) {
                configurationJson.devices.splice(Number(index), 1, device);
              }
            }
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.updateUser == true) {
            //update user
            let user: user = request.body.user as user;
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for(let index in configurationJson.users){
              if(user.id == configurationJson.users[index].id){
                configurationJson.users.splice(Number(index), 1, user);
              }
            }
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.updateTemplate == true) {
            //update template
            let template: template = request.body.template;
            let configurationJson : configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let index in configurationJson.templates) {
              if (
                template.id == configurationJson.templates[index].id
              ) {
                configurationJson.templates.splice(Number(index), 1, template);
              }
            }

            let templateBase = fs.readFileSync(__dirname + "/../frontend/protected/templateBase.html", {encoding:"utf-8"});

            let titleSeparator = templateBase.split("<title>");
            titleSeparator.splice(1, 0, "<title>" + request.body.template.name);
            templateBase = "";
            for(let element of titleSeparator)
              templateBase+=element;

            let bodySeparator = templateBase.split("<body>");
            bodySeparator.splice(1, 0, "<body>" + request.body.content);
            templateBase = "";
            for(let element of bodySeparator)
              templateBase+=element;

            console.log(templateBase);

            fs.writeFileSync(
              __dirname + "/../frontend/protected/templates/" + template.name + ".html",
              templateBase,
              { encoding: "utf-8" }
            );
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );

            request.body.return = true;
          }
          if(request.body.generateNewDynamicPassword == true){
            let user: user = request.body.user as user;
            let configurationJson : configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            //let updatedUser: user;
            for(let index in configurationJson.users){
              if(configurationJson.users[index].id == user.id){
                configurationJson.users[index].dynamicPassword = password.generateNewPassword();
                request.body.user = configurationJson.users[index];
              }
            }
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
        } catch (error) {
          console.error(error);
        }
        console.log(request.body);
        response.send(request.body);
      });
      
      app.delete("/data", login.check, async (request: any, response: any) => {
        console.log(request.body);
        try {
          if (request.body.deleteDevice == true) {
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let index in configurationJson.devices) {
              if (request.body.device.id == configurationJson.devices[index].id) {
                configurationJson.devices.splice(Number(index), 1);
              }
            }
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.deleteTemplate == true) {
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let index in configurationJson.templates) {
              if (
                request.body.template.id == configurationJson.templates[index].id
              ) {
                configurationJson.templates.splice(Number(index), 1);
              }
            }
            fs.unlinkSync(
              __dirname + "/../frontend/protected/templates/" + request.body.template.name + ".html"
            );
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.deleteUser == true) {
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let index in configurationJson.users) {
              if (request.body.user.id == configurationJson.users[index].id) {
                configurationJson.users.splice(Number(index), 1);
              }
            }
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
          if (request.body.deleteUserByMyself == true) {
            let configurationJson: configuration = JSON.parse(
              fs.readFileSync(__dirname + "/../configuration.json", {
                encoding: "utf-8",
              })
            );
            for (let index in configurationJson.users) {
              if (request.body.user.name == configurationJson.users[index].name) {
                configurationJson.users.splice(Number(index), 1);
              }
            }
            fs.writeFileSync(
              __dirname + "/../configuration.json",
              JSON.stringify(configurationJson),
              { encoding: "utf-8" }
            );
            request.body.return = true;
          }
        } catch (error) {
          console.error(error);
        }
        console.log(request.body);
        response.send(request.body);
      });

      return app;
}