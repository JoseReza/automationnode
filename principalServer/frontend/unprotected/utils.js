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
      return document.getElementsByTagName("render")[0];
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
          responseJson.data = responseFromServer.data;
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

function showInfo() {
  console.log("Automation Node", "----------------------------------------");
  console.extraInfo("Available functions:");
  JSON.stringify(Utils(), function (key, val) {
    if (typeof val === "function") {
      console.extraInfo(`--> utils.${key}() : async function`);
    }
    return val;
  });
  console.log("----------------------------------------");
}
showInfo();

const initContentTemplate = `
<render></render>
<script>
    let render = utils.getRender();
    render.innerHTML = '<h1>This is a new template!!</h1>';
    console.log("Hello world!!");
</script>`;
