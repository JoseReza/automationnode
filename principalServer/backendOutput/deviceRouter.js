"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nodeFetch = require("node-fetch");
const login = require("./login");
const time = require("./time");
const fs = require("fs");
function start(app) {
    app.get("/camera", login.check, (request, response) => __awaiter(this, void 0, void 0, function* () {
        console.log("-->", request.query);
        if (request.query) {
            let device = JSON.parse(request.query.device);
            //console.log("llega aqui -1");
            try {
                let data = undefined;
                let base64 = undefined;
                //console.log("llega aqui 0");
                try {
                    data = yield nodeFetch(`http://${device.direction}/capture`);
                    data = yield data.blob();
                    //console.log(data);
                }
                catch (_a) {
                    console.error(`-->  ${device.direction} : Not listened`);
                    response.send({ return: false, data: "Device not connected" });
                    return;
                }
                try {
                    data = Buffer.from(yield data.arrayBuffer());
                    //console.log("-->arrayData:", data);
                    data = data.toString("base64");
                    base64 = "data:image/png;base64," + data;
                }
                catch (error) {
                    //console.error(error);
                    response.send({ return: false, data: "Device not connected" });
                    return;
                }
                response.send({ data: base64, return: true });
                return;
            }
            catch (_b) {
                response.send({ return: false, data: "Device not connected" });
                return;
            }
        }
    }));
    app.post("/fpga", login.check, (request, response) => __awaiter(this, void 0, void 0, function* () {
        request.body.return = false;
        try {
            if (request.body.getReadings == true) {
                request.body.data = yield nodeFetch(`http://${request.body.device.direction}:${request.body.device.port}/data`, {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        getReadings: true,
                    }),
                });
                request.body.data = request.body.data.json();
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
module.exports = { start };
