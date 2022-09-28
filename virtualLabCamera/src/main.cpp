#include "Arduino.h"
#include "s_spiffs.h"
#include "s_json.h"
#include "s_wifi.h"
#include "s_server.h"

void setup(){

    Serial.begin(115200);
    spiffsStart();
    initCamera();
    DynamicJsonDocument configuration = stringToJson(readFile("/configuration.json"));
    serializeJsonPretty(configuration, Serial);
    

    if (configuration["wifi"]["client"]["activated"] == true)
    {
        wifiClientConnect(configuration["wifi"]["client"]["name"], configuration["wifi"]["client"]["password"], configuration);
    }
    else if (configuration["wifi"]["accessPoint"]["activated"] == true)
    {
        wifiAccesPointConnect( configuration["wifi"]["accessPoint"]["name"], configuration["wifi"]["accessPoint"]["password"], configuration["system"]["id"]);
    }

    serverStart();
}

void loop(){
    delay(500);
  if(restart){
    delay(1000); ESP.restart();
  }
}