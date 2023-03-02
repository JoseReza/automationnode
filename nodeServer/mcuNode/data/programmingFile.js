async function start() {
  await node.executeInstruction(location.host, "password", {
    action: "pinMode",
    gpio: 13,
    value: "OUTPUT",
  });

  let outputState = false;
  let latencyArray = [];

  for (let i = 0; i < 100; i++) {
    let timeStart = Date.now();
    outputState = !outputState;
    if (outputState) {
      await node.executeInstruction(location.host, "password", {
        action: "digitalWrite",
        gpio: 13,
        value: "HIGH",
      });
    } else {
      await node.executeInstruction(location.host, "password", {
        action: "digitalWrite",
        gpio: 13,
        value: "LOW",
      });
    }
    let timeEnd = Date.now();
    let latency = timeEnd - timeStart;
    latencyArray.push(latency);

    console.log(JSON.stringify({ iteration: i, latency: latency }));
  }

  let sum = 0;
  for (let i of latencyArray) {
    sum += i;
  }
  let latencyAverage = sum / latencyArray.length;
  let instructionsPerSecond = (1000 / latencyAverage).toFixed(2);
  let platform = navigator.platform;
  console.log(
    JSON.stringify({ latencyAverage, instructionsPerSecond, platform })
  );
}
start();
