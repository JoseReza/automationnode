let deviceName = document.getElementById("deviceName");
let deviceNameTitle = document.getElementById("deviceNameTitle");
let deviceNotConnected = document.getElementById("deviceNotConnected");
let buttonCancel = document.getElementById("buttonCancel");
let video = document.getElementById("video");

let urlParams = new URLSearchParams(window.location.search);
let user = JSON.parse(urlParams.get("user"));
console.log(user);
let device = JSON.parse(urlParams.get("device"));
console.log(device);

deviceName.innerText = device.name;
deviceNameTitle.innerText = device.name;

buttonCancel.addEventListener("click", function () {
  window.close();
});

let interval = undefined;

async function start() {
  interval = setInterval(async function () {
    let response = await fetch(
      `${location.origin}/camera?user=${JSON.stringify(
        user
      )}&device=${JSON.stringify(device)}`
    );
    response = await response.json();
    console.log(response);
    if (response.return) {
      video.setAttribute("src", response.data);
      video.style.display = "block";
      deviceNotConnected.style.display = "none";
    } else {
      video.style.display = "none";
      deviceNotConnected.style.display = "block";
      clearInterval(interval);
      setTimeout(start, 15000);
    }
  }, 100);
}
start();
