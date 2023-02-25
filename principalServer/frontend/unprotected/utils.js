function Utils() {
  return {
    wait: async function (delay) {
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    },

    fetchInnerNetwork: async function (
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
      console.extraInfo(`--> Utils().${key}`);
    }
    return val;
  });
  console.log("----------------------------------------");
}
showInfo();

const initContentTemplate = `
<div id="template"></div>
<script>
    let template = document.getElementById("template");
    template.innerHTML = '<h1>This is a new template!!</h1>';
    console.log("Hello world!!");
</script>`;
