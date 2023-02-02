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
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const fs = __importStar(require("fs"));
function start(intervalUpdate) {
    setInterval(() => {
        let configurationJson = JSON.parse(fs.readFileSync(__dirname + "/../configuration.json", { encoding: "utf-8" }));
        //listen for new datetimes
        for (let user of configurationJson.users) {
            for (let template of user.templates) {
                const date = new Date();
                if (template.schedule.start.hours >= date.getHours() && template.schedule.end.hours < date.getHours())
                    if (template.schedule.start.minutes >= date.getMinutes() && template.schedule.end.minutes < date.getMinutes())
                        if (template.schedule.start.seconds >= date.getSeconds() && template.schedule.end.seconds < date.getSeconds())
                            console.log("-->Inner time: ", template);
            }
        }
        fs.writeFileSync(__dirname + "/../configuration.json", JSON.stringify(configurationJson), { encoding: "utf-8" });
    }, intervalUpdate);
}
exports.start = start;
