
export let content = "";

const consoleOldLog = console.log;
console.log = function (message, ...args) {
  consoleOldLog(message);
  content += message;
  try {
    for (let log of args) {
      console.log(log);
    }
  } catch {}
};

const consoleOldError = console.error;
console.error = function (message, ...args) {
  consoleOldError(message);
  content += message;
  try {
    for (let log of args) {
      console.error(log);
    }
  } catch {}
};

const consoleOldWarn = console.warn;
console.warn = function (message, ...args) {
  consoleOldWarn(message);
  content += message;
  try {
    content += message;
    for (let log of args) {
      console.warn(log);
    }
  } catch {}
};

const consoleOldInfo = console.info;
console.info = function (message, ...args) {
  consoleOldInfo(message);
  content += message;
  try {
    content += message;
    for (let log of args) {
      console.info(log);
    }
  } catch {}
};

export function clear(){
  content = "";
}
setInterval(clear, 60000);