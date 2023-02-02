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
let nodeFetch = require("node-fetch");
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
exports.start = start;
