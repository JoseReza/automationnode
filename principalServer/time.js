async function wait(delay) {
  await new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

module.exports = { wait };
