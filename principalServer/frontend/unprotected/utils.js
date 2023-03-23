let utils = Utils();

function Utils() {
  return {

    getConfiguration: async function(){
      let url = new URL(location.href);
      let user = JSON.parse(url.searchParams.get("user"));
      let configurationJson = await fetch(`/configuration.json?user=${JSON.stringify(user)}`);
      return await configurationJson.json();
    },
    getUser: async function(){
      let url = new URL(location.href);
      let user = JSON.parse(url.searchParams.get("user"));
      return user;
    },
    getRender: async function(){
      let render = document.getElementsByTagName("render")[document.getElementsByTagName("render").length - 1];
      return render;
    },

    wait: async function (delay) {
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    },

    fetch: async function (
      url,
      method = undefined,
      body = undefined
    ) {
      let responseJson = {};
      let user = {};
      try {
        let urlParams = new URL(location.href);
        user = JSON.parse(urlParams.searchParams.get("user"));
        let response = {};
        response = await fetch(
          `${location.origin}/petition?user=${JSON.stringify(user)}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "post",
            body: JSON.stringify({
              petition: {
                url,
                method,
                body,
              },
            }),
          }
        );
        let responseFromServer = await response.json();
        if(responseFromServer.return){
          let responseFromServerArrayBuffer = [];
          for(let key of Object.keys(responseFromServer.data)){
            responseFromServerArrayBuffer.push(responseFromServer.data[key]);
          }
          responseJson.data = responseFromServerArrayBuffer;
          responseJson.type = responseFromServer.type;
          responseJson.getBase64 = function() {
              let charsConcatenated = '';
              for (var i = 0; i < responseFromServerArrayBuffer.length; i++) {
                  charsConcatenated += String.fromCharCode( responseFromServerArrayBuffer[ i ] );
              }
              return `data:${responseFromServer.type};base64,${window.btoa( charsConcatenated )}`;
          }
          responseJson.getText = function() {
              let charsConcatenated = '';
              for (var i = 0; i < responseFromServerArrayBuffer.length; i++) {
                  charsConcatenated += String.fromCharCode( responseFromServerArrayBuffer[ i ] );
              }
              return charsConcatenated;
          }
          responseJson.return = true;
        }else{
          responseJson.data = responseFromServer.data;
          responseJson.return = false;
        }
      } catch (error) {
        console.error(error);
        responseJson.data = error;
        responseJson.petition = {
          url,
          method,
          body,
        };
        responseJson.return = false;
      }
      return responseJson;
    },
  };
}

async function showInfo() {
  console.log("Automation Node", "----------------------------------------");
  console.extraInfo("Available functions:");
  JSON.stringify(Utils(), function (key, val) {
    if (typeof val === "function") {
      console.extraInfo(`--> utils.${key}() : async function`);
    }
    return val;
  });
  console.log("----------------------------------------");
  let configuration = await utils.getConfiguration();
  console.extraInfo("Available devices:");
  for(let device of configuration.devices){
    console.extraInfo(JSON.stringify(device));
  }
}
showInfo();

const initContentTemplate = `
<render></render>
<script>
async function start(){
    let render = await utils.getRender();
    render.innerHTML = '<h1>This is a new template!!</h1>';
    console.log("Hello world!!");
}start();
</script>`;
