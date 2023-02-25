const divConsole = document.getElementById("divConsole");
divConsole.style.overflowY = "scroll";
divConsole.style.backgroundColor = "black";
divConsole.style.color = "white";

let divInnerConsole = document.createElement("div");
divInnerConsole.style.margin = "1rem";
divInnerConsole.style.marginBottom = "2rem";
divConsole.appendChild(divInnerConsole);

const consoleOldLog = console.log;
console.log = function (message, ...args) {
  consoleOldLog(message);
  divConsole.scrollTop = divConsole.scrollHeight;
  try {
    let divMessage = document.createElement("div");
    divMessage.style.backgroundColor = "black";
    divMessage.innerText = message;
    divInnerConsole.appendChild(divMessage);
    for (let log of args) {
      console.log(log);
    }
  } catch {}
};

const consoleOldError = console.error;
console.error = function (message, ...args) {
  consoleOldError(message);
  divConsole.scrollTop = divConsole.scrollHeight;
  try {
    let divMessage = document.createElement("div");
    divMessage.style.backgroundColor = "red";
    divMessage.innerText = message;
    divInnerConsole.appendChild(divMessage);
    for (let log of args) {
      console.error(log);
    }
  } catch {}
};

const consoleOldWarn = console.warn;
console.warn = function (message, ...args) {
  consoleOldWarn(message);
  divConsole.scrollTop = divConsole.scrollHeight;
  try {
    let divMessage = document.createElement("div");
    divMessage.style.backgroundColor = "orange";
    divMessage.innerText = message;
    divInnerConsole.appendChild(divMessage);
    for (let log of args) {
      console.warn(log);
    }
  } catch {}
};

const consoleOldInfo = console.info;
console.info = function (message, ...args) {
  consoleOldInfo(message);
  divConsole.scrollTop = divConsole.scrollHeight;
  try {
    let divMessage = document.createElement("div");
    divMessage.style.backgroundColor = "green";
    divMessage.innerText = message;
    divInnerConsole.appendChild(divMessage);
    for (let log of args) {
      console.info(log);
    }
  } catch {}
};

console.extraInfo = function (message, ...args) {
  consoleOldInfo(message);
  divConsole.scrollTop = divConsole.scrollHeight;
  try {
    let divMessage = document.createElement("div");
    divMessage.style.backgroundColor = "#2196f3";
    divMessage.innerText = message;
    divInnerConsole.appendChild(divMessage);
    for (let log of args) {
      console.info(log);
    }
  } catch {}
};

const consoleOldClear = console.clear;
console.clear = function () {
  consoleOldClear();
  try {
    divInnerConsole.innerHTML = "";
  } catch {}
};
