const express = require("express");
const fs = require("fs");

console.log("hello world from my branch");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send(
    fs.readFileSync(__dirname + "/public/index.html", { encoding: "utf-8" })
  );
});

app.put("/data", function(req, res){
  console.log(req.query);
  res.send(req.query)
})

app.get("/streaming", function (req, res) {
  res.send({ response: 200 });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
