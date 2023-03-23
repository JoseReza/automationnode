#include "Arduino.h"
#include "s_spiffs.h"
#include "s_json.h"
#include "s_display.h"
#include "s_wifi.h"
#include "s_server.h"

void setup(){

    Serial.begin(115200);

    spiffsStart();
    initCamera();

    pinMode(4, OUTPUT);
    digitalWrite(4, LOW);

    displayStart();
    displayPresentation();


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
  delay(100);

  displayLoop(wifiname, wifipassword, localIp);
  if(restart){
    displayRestarting();
    delay(1000); ESP.restart();
  }
}