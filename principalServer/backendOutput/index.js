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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deviceRouter = __importStar(require("./deviceRouter"));
const childProcess = __importStar(require("child_process"));
const dataRouter = __importStar(require("./dataRouter"));
const events = __importStar(require("./events"));
const dotenv = __importStar(require("dotenv"));
const login = __importStar(require("./login"));
const ngrok = __importStar(require("ngrok"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const express_1 = __importDefault(require("express"));
//Boot
express_1.default;
let app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv.config();
//Get configuration json
let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", {
    encoding: "utf-8",
}));
//Update passwords
events.start(configurationJson.server.intervalUpdate);
//Without login
app.get("/publicUrl", (request, response) => {
    let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8" }));
    response.send(configurationJson["ngrok"]["url"]);
});
app.get("/login.html", (request, response) => {
    response.send(fs.readFileSync(__dirname + "/../frontend/protected/login.html", { encoding: "utf-8" }));
});
//With login
app.get("/", login.check, (request, response) => {
    response.send(fs.readFileSync(__dirname + "/../protected/login.html", { encoding: "utf-8" }));
});
app.get("/configuration.json", login.check, (request, response) => {
    response.send(fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8" }));
});
app = dataRouter.start(app);
app = deviceRouter.start(app);
app.use("/", express_1.default.static(__dirname + "/../frontend/unprotected")); //unprotected for assets
app.use(login.check).use("/", express_1.default.static(__dirname + "/../frontend/protected")); //protected for html views
app.listen(Number(configurationJson["server"]["port"]), () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Example app listening on port ${Number(configurationJson["server"]["port"])}`);
    try {
        let ngrokUrl = yield ngrok.connect({
            proto: "http",
            addr: Number(configurationJson["server"]["port"]),
            authtoken: process.env.authtoken,
        });
        configurationJson["ngrok"]["url"] = ngrokUrl;
        console.log("ngrokUrl: ", ngrokUrl);
        fs.writeFileSync(`${__dirname}/../configuration.json`, JSON.stringify(configurationJson), { encoding: "utf-8" });
    }
    catch (error) {
        console.error(error);
        console.log("-->Probably the ngrok authtoken is wrong or expired");
    }
    if (os.platform() == "win32") {
        if (configurationJson["server"]["showBrowser"] &&
            configurationJson["server"]["production"]) {
            childProcess.exec(`start msedge --kiosk http://localhost:${Number(configurationJson["server"]["port"])} --edge-kiosk-type=fullscreen`);
        }
        else if (configurationJson["server"]["showBrowser"] &&
            !configurationJson["server"]["production"]) {
            childProcess.exec(`start msedge http://localhost:${Number(configurationJson["server"]["port"])}`);
        }
    }
    if (os.platform() == "linux") {
        if (configurationJson["server"]["showBrowser"]) {
            childProcess.exec(`chromium-browser http://localhost:${Number(configurationJson["server"]["port"])} --kiosk`);
        }
        else if (configurationJson["server"]["showBrowser"] &&
            !configurationJson["server"]["production"]) {
            childProcess.exec(`chromium-browser http://localhost:${Number(configurationJson["server"]["port"])}`);
        }
    }
}));
