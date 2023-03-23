#ifndef display_h
#define display_h

#include <Arduino.h>
#include "Wire.h"             // libreria para bus I2C
#include "Adafruit_SSD1306.h" // libreria para controlador SSD1306

Adafruit_SSD1306 oled(128, 64, &Wire); // crea objeto

void displayStart()
{
  Wire.begin();
  Wire.begin(15, 14);                     // inicializa bus I2C
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C); // inicializa pantalla con direccion 0x3C
}

void displayPresentation()
{
  oled.clearDisplay();
  oled.setTextColor(WHITE);
  oled.setCursor(0, 0);
  oled.setTextSize(2);
  oled.print("CameraNode");
  oled.setCursor(52, 28);
  oled.setTextSize(2);
  oled.print("V1");
  oled.display();
}

void displayRestarting()
{

  oled.clearDisplay();
  oled.setTextColor(WHITE);
  oled.setCursor(0, 0);
  oled.setTextSize(2);
  oled.print("Restarting");
  oled.setCursor(52, 28);
  oled.setTextSize(2);
  oled.print("V1");
  oled.display();
}

long timer1 = 0;
byte presentation = 0;

void displayLoop(String wifiname, String wifipassword, String localIp)
{

  if ((millis() - timer1) > 4000)
  {
    timer1 = millis();
    switch (presentation)
    {
    case 0:
      oled.clearDisplay();
      oled.setTextColor(WHITE);
      oled.setCursor(0, 0);
      oled.setTextSize(2);
      oled.print(localIp);
      oled.display();
      break;
    case 1:
      oled.clearDisplay();
      oled.setTextColor(WHITE);
      oled.setCursor(0, 0);
      oled.setTextSize(2);
      oled.print(wifiname);
      oled.display();
      break;
    case 2:
      oled.clearDisplay();
      oled.setTextColor(WHITE);
      oled.setCursor(0, 0);
      oled.setTextSize(2);
      oled.print(wifipassword);
      oled.display();
      break;
    }
    presentation ++;
    if(presentation > 2){
      presentation = 0;
    }
  }
}

#endif
