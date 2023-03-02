#ifndef _interpreter_h
#define _interpreter_h
#include <Arduino.h>
#include <analogWrite.h>
#include "_json.h"
#include "_spiffs.h"
#include "_wifi.h"
#include "_display.h"

bool restart = false;

DynamicJsonDocument unparse(DynamicJsonDocument contentJson)
{
    Serial.println("--> contentJson inside unparse function: " + jsonToString(contentJson));
    if (contentJson["get"]["backendJson"] == true)
    {
        contentJson["return"] = true;
        contentJson["content"] = backendJson;
        return contentJson;
    }
    if (contentJson["get"]["programmingFile"] == true)
    {
        DynamicJsonDocument contentJson(1024 * 20);
        contentJson["return"] = true;
        contentJson["content"] = readFile("/programmingFile.js");
        return contentJson;
    }
    if (contentJson["set"]["programmingFile"] == true)
    {
        String content = contentJson["content"];
        Serial.println();
        Serial.println();
        Serial.println();
        Serial.println("--> Content: " + content);
        saveFile("/programmingFile.js", content);
        contentJson["return"] = true;
        return contentJson;
    }
    if (contentJson["set"]["wifi"]["configuration"] == true)
    {
        String client = contentJson["client"];
        Serial.println("--> contentJson[set][wifi][configuration]: " + client);
        backendJson["wifi"]["client"] = contentJson["client"];
        backendJson["wifi"]["accessPoint"]["activated"] = !contentJson["client"]["activated"];
        saveFile("/backend.json", jsonToString(backendJson));
        contentJson["return"] = true;
        restart = true;
        return contentJson;
    }
    if (contentJson["execute"] == true)
    {
        String instruction = contentJson["instruction"];
        Serial.println("--> contentJson[execute]: " + instruction);

        if (contentJson["instruction"]["action"] == "pinMode")
        {
            uint8_t gpio = contentJson["instruction"]["gpio"];
            String value = contentJson["instruction"]["value"];
            if (value == "OUTPUT")
            {
                pinMode(gpio, OUTPUT);
            }
            else if (value == "INPUT")
            {
                pinMode(gpio, INPUT);
            }
            contentJson["instruction"]["executed"] = true;
            contentJson["instruction"]["return"] = contentJson["instruction"]["value"];
            contentJson["return"] = true;
            return contentJson;
        }
        if (contentJson["instruction"]["action"] == "digitalWrite")
        {
            uint8_t gpio = contentJson["instruction"]["gpio"];
            String value = contentJson["instruction"]["value"];
            if (value == "HIGH")
            {
                digitalWrite(gpio, HIGH);
            }
            else if (value == "LOW")
            {
                digitalWrite(gpio, LOW);
            }
            contentJson["instruction"]["executed"] = true;
            contentJson["instruction"]["return"] = contentJson["instruction"]["value"];
            contentJson["return"] = true;
            return contentJson;
        }
        if (contentJson["instruction"]["action"] == "analogWrite")
        {
            uint8_t gpio = contentJson["instruction"]["gpio"];
            uint32_t value = contentJson["instruction"]["value"];
            analogWrite(gpio, value);
            contentJson["instruction"]["executed"] = true;
            contentJson["instruction"]["return"] = value;
            contentJson["return"] = true;
            return contentJson;
        }
        if (contentJson["instruction"]["action"] == "digitalRead")
        {
            int gpio = contentJson["instruction"]["gpio"];
            contentJson["instruction"]["executed"] = true;
            contentJson["instruction"]["return"] = bool(digitalRead(gpio));
            contentJson["return"] = true;
            return contentJson;
        }
        if (contentJson["instruction"]["action"] == "analogRead")
        {
            int gpio = contentJson["instruction"]["gpio"];
            contentJson["instruction"]["executed"] = true;
            contentJson["instruction"]["return"] = analogRead(gpio);
            contentJson["return"] = true;
            return contentJson;
        }
        contentJson["return"] = false;
        return contentJson;
    }
    contentJson["return"] = false;
    return contentJson;
}

#endif