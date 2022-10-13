let addNewDevice = document.getElementById("addNewDevice");
let deleteDevice = document.getElementById("deleteDevice");
let menuAddDevice = document.getElementById("menuAddDevice");
let buttonCancelMenuAddDevice = document.getElementById(
  "buttonCancelMenuAddDevice"
);
let buttonConfirmMenuAddNDevice = document.getElementById(
  "buttonConfirmMenuAddDevice"
);

let addNewDeviceMenuName = document.getElementById("addNewDeviceMenuName");
let addNewDeviceMenuSelectProtocol = document.getElementById(
  "addNewDeviceMenuSelectProtocol"
);
let divMenuSelectProtocol = document.getElementById("divMenuSelectProtocol");
let addNewDeviceMenuIp0 = document.getElementById("addNewDeviceMenuIp0");
let addNewDeviceMenuIp1 = document.getElementById("addNewDeviceMenuIp1");
let addNewDeviceMenuIp2 = document.getElementById("addNewDeviceMenuIp2");
let addNewDeviceMenuIp3 = document.getElementById("addNewDeviceMenuIp3");
let addNewDeviceMenuSelectPort = document.getElementById(
  "addNewDeviceMenuSelectPort"
);

let devicesArray = [];
let deviceSelected = 0;
let devicesList = document.getElementById("devicesList");

async function start() {
  let responseString = await fetch("/configuration.json");
  let responseJson = await responseString.json();
  console.log(responseJson);

  if (responseJson) {
    addNewDevice.addEventListener("click", function () {
      showAddDeviceMenu();
    });

    addNewDeviceMenuSelectProtocol.addEventListener("change", function () {
      let indexSelected = 0;
      for (let i in addNewDeviceMenuSelectProtocol.children) {
        if (
          addNewDeviceMenuSelectProtocol.children[i].value ==
          addNewDeviceMenuSelectProtocol.value
        ) {
          indexSelected = i;
        }
      }
      for (let i in divMenuSelectProtocol.children) {
        divMenuSelectProtocol.children[i].style.visibility = "hidden";
        if (i == indexSelected) {
          divMenuSelectProtocol.children[i].style.visibility = "visible";
        }
      }
    });

    buttonConfirmMenuAddNDevice.addEventListener("click", async function () {
      let body = {
        saveNewDevice: true,
        device: {
          name: addNewDeviceMenuName.value,
          protocol: addNewDeviceMenuSelectProtocol.value,
          direction: "",
        },
      };

      if (addNewDeviceMenuSelectProtocol.value == "tcp/ip") {
        body.device.direction = `${addNewDeviceMenuIp0.value}.${addNewDeviceMenuIp1.value}.${addNewDeviceMenuIp2.value}.${addNewDeviceMenuIp3.value}`;
      } else if (addNewDeviceMenuSelectProtocol.value == "serial") {
        body.device.direction = addNewDeviceMenuSelectPort.value;
      }

      let response = await fetch("/data", {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let responseJson = await response.json();

      if (responseJson.return == true) {
        location.reload();
      }
    });

    buttonCancelMenuAddDevice.addEventListener("click", hideAddDeviceMenu);

    deleteDevice.addEventListener("click", async function () {
      let body = {
        deleteDevice: true,
        device: devicesArray[deviceSelected].configuration,
      };
      let response = await fetch("/data", {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let responseJson = await response.json();

      if (responseJson.return == true) {
        location.reload();
      }
    });

    for (let i in responseJson.devices) {
      let deviceHtml = document.createElement("tr");

      devicesArray.push({
        configuration: responseJson.devices[i],
        html: deviceHtml,
      });

      devicesArray[i].html.classList.add("table-primary");
      devicesArray[i].html.innerHTML = `
                                <th class="bg-primary" style="color: white;">${devicesArray[i].configuration.name}</th>
                                <td>${devicesArray[i].configuration.protocol}</td>
                                <td>${devicesArray[i].configuration.direction}</td>
                    `;

      let tdElement = document.createElement("td");
      let buttonVideo = document.createElement("button");
      buttonVideo.innerText = "View";
      buttonVideo.classList.add("btn");
      buttonVideo.classList.add("btn-info");
      buttonVideo.style.color = "black";
      tdElement.appendChild(buttonVideo);

      devicesArray[i].html.appendChild(tdElement);

      buttonVideo.addEventListener("click", async function () {
        window.open(`video.html?name=${devicesArray[i].configuration.name}`);
      });

      devicesArray[i].html.addEventListener("click", function () {
        deviceSelected = i;
        for (let i of devicesArray) {
          i.html.classList.remove("bg-primary");
          i.html.classList.remove("text-white");
        }
        devicesArray[i].html.classList.add("bg-primary");
        devicesArray[i].html.classList.add("text-white");
        console.log(deviceSelected);
      });

      devicesList.appendChild(deviceHtml);
    }
    devicesArray[0].html.classList.add("bg-primary");
    devicesArray[0].html.classList.add("text-white");
    console.log(devicesArray);
  } else {
    console.error("recurso no encontrado");
  }
}
start();

function showAddDeviceMenu() {
  menuAddDevice.style.visibility = "visible";
  menuAddDevice.style.position = "relative";
}

function hideAddDeviceMenu() {
  menuAddDevice.style.visibility = "hidden";
  menuAddDevice.style.position = "absolute";
}
