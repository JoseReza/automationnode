#include <Arduino.h>
#include "_spiffs.h"
#include "_json.h"
#include "_wifi.h"
#include "_display.h"
#include "_interpreter.h"
#include "_server.h"

void setup()
{

  Serial.begin(115200); // comunicacion serial

  spiffsStart();
  displayStart();

  backendJson = stringToJson(readFile("/backend.json"));
  serializeJsonPretty(backendJson, Serial);

  displayPresentation();
  displayConnecting();

  if (backendJson["wifi"]["client"]["activated"] == true)
  {
    wifiClientConnect(backendJson["wifi"]["client"]["name"], backendJson["wifi"]["client"]["password"]);
  }
  else if (backendJson["wifi"]["accessPoint"]["activated"] == true)
  {
    wifiAccesPointConnect(backendJson["system"]["name"], backendJson["system"]["password"]);
  }

  displayInfo();
  serverStart();
}

void loop()
{

  pinMode(1, OUTPUT);
  digitalWrite(1, 1);
  delay(10000);
  digitalWrite(1, 0);
  delay(10000);

  pinMode(2, OUTPUT);
  digitalWrite(2, 1);
  delay(10000);
  digitalWrite(2, 0);
  delay(10000);

  pinMode(3, OUTPUT);
  digitalWrite(3, 1);
  delay(10000);
  digitalWrite(3, 0);
  delay(10000);

  pinMode(4, OUTPUT);
  digitalWrite(4, 1);
  delay(10000);
  digitalWrite(4, 0);
  delay(10000);

  if (backendJson["wifi"]["accessPoint"]["activated"] == true)
  {
    dnsServer.processNextRequest();
  }
  if (restart)
  {
    displayRestarting();
    delay(500);
    ESP.restart();
  }
}