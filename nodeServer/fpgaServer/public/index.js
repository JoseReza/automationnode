let url = document.getElementById("url");
let ip = document.getElementById("ip");
let port = document.getElementById("port");

async function start() {
  let getNetwork = await fetch("/data", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      getNetwork: true,
    }),
  });
  getNetwork = await getNetwork.json();
  console.log(getNetwork);
  url.innerHTML = `${getNetwork.data.ip}:${getNetwork.data.port}`;
  ip.innerHTML = getNetwork.data.ip;
  port.innerHTML = getNetwork.data.port;
}
start();
