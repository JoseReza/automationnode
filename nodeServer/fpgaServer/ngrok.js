const { exec } = require("child_process");
const os = require("os");

let fpgaIDEPort = 1234;

function start(){
    if(os.platform() == "win32"){
        exec(`${__dirname}/../../ngrok-windows.exe http ${fpgaIDEPort}`, (error, stdout)=>{
            if(error){
                console.log("error", error);
            }
            if(stdout){
                console.log("stdout", stdout);
            }
        });
    }
    if(os.platform() == "linux"){
        exec(`${__dirname}/../../ngrok-linux http ${fpgaIDEPort}`, (error, stdout)=>{
            if(error){
                console.log("error", error);
            }
            if(stdout){
                console.log("stdout", stdout);
            }
        });
    }
}

module.exports = {start}