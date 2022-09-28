
#ifndef _wifi_h
#define _wifi_h

#include <Arduino.h>
#include <WiFi.h>

char wifiname[30] = "";
char wifipassword[30] = "";
String localIp;

void wifiAccesPointConnect(String wifiName, String wifiPassword, String id)
{

  wifiName = wifiName + id;

  wifiName.toCharArray(wifiname, 29);
  wifiPassword.toCharArray(wifipassword, 20);


  Serial.println("wifiAPname: " + String(wifiname));
  Serial.println("wifiAPpassword: " + String(wifipassword));
  Serial.println("Connecting");

  WiFi.mode(WIFI_AP);
  WiFi.softAP(wifiname , wifipassword);

  Serial.println("Connected!");
  Serial.print("WIFINODE IP address: ");
  localIp = WiFi.softAPIP().toString();
  Serial.println("Local ip: " + localIp);
}

void wifiClientConnect(String wifiName, String wifiPassword, DynamicJsonDocument configuration)
{

  wifiName.toCharArray(wifiname, 20);
  wifiPassword.toCharArray(wifipassword, 20);

  Serial.println("\nwifiname: " + String(wifiname));
  Serial.println("wifipassword: " + String(wifipassword));
  Serial.println("Connecting");

  if(configuration["wifi"]["client"]["ipMode"]["static"] == true){
    IPAddress local_IP(configuration["wifi"]["client"]["ip"]["static"]["0"], configuration["wifi"]["client"]["ip"]["static"]["1"], configuration["wifi"]["client"]["ip"]["static"]["2"], configuration["wifi"]["client"]["ip"]["static"]["3"]);
    IPAddress gateway(configuration["wifi"]["client"]["ip"]["gateway"]["0"], configuration["wifi"]["client"]["ip"]["gateway"]["1"], configuration["wifi"]["client"]["ip"]["gateway"]["2"], configuration["wifi"]["client"]["ip"]["gateway"]["3"]);
    IPAddress subnet(configuration["wifi"]["client"]["ip"]["subnet"]["0"], configuration["wifi"]["client"]["ip"]["subnet"]["1"], configuration["wifi"]["client"]["ip"]["subnet"]["2"], configuration["wifi"]["client"]["ip"]["subnet"]["3"]);
    if (!WiFi.config(local_IP, gateway, subnet))
    {
      Serial.println("Error in wifi client static configuration.");
    }
  }

  WiFi.begin(wifiname, wifipassword);

  int count = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    count++;
    Serial.print(".");
    if (count == 20)
    {
      String name = configuration["wifi"]["accessPoint"]["name"];
      String password = configuration["wifi"]["accessPoint"]["password"];
      String id = configuration["system"]["id"];

      return wifiAccesPointConnect( name, password, id);
    }
  }

  Serial.println("Connected!");
  Serial.print("WIFINODE IP address: ");
  localIp = WiFi.localIP().toString();
  Serial.println("Local ip: " + localIp);
}

#endif