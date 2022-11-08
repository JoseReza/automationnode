#ifndef _json_h
#define _json_h
#include <Arduino.h>
#include <ArduinoJson.h>

DynamicJsonDocument backendJson(1024*20);

DynamicJsonDocument stringToJson(String jsonString){
    DynamicJsonDocument json(1024*20);
    deserializeJson(json, jsonString);
    return json;
}

String jsonToString(DynamicJsonDocument json){
    String jsonString = "";
    serializeJson(json, jsonString);
    return jsonString;
}



#endif