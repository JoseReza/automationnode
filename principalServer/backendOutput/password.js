"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewPassword = void 0;
function generateNewPassword() {
    let newPassword = "";
    for (let index = 0; index < 8; index++) {
        let newChar = String.fromCharCode(48 + Math.floor(Math.random() * 42));
        newPassword += newChar;
    }
    return newPassword;
}
exports.generateNewPassword = generateNewPassword;
