const serialListener = require("./serialListener");
const ngrok = require("./ngrok");
const express = require("express");
var app = express();
const port = 10000;

app.use(express.json());
app.use(express.static("public"));

ngrok.start();

app.get("/data", async(request, response)=>{
  response.send(globalData);
});

let globalData = {};
serialListener.start(function(localData) {
  globalData = localData;
});

app.listen(port, function(){
  console.log("Server is ready on port: ", port )
});