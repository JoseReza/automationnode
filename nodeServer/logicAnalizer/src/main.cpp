#include <Arduino.h>

void setup()
{
  Serial.begin(115200);
  Serial.println("hello world!!");
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(A2, INPUT);
  pinMode(A3, INPUT);
  pinMode(A4, INPUT);
  pinMode(A5, INPUT);
}

void loop()
{
  String jsonString = "{\"A0\": \"" + String(analogRead(A0)) + "\", \"A1\": \"" + String(analogRead(A1)) + "\", \"A2\": \"" + String(analogRead(A2)) + "\", \"A3\": \"" + String(analogRead(A3)) + "\", \"A4\": \"" + String(analogRead(A4)) + "\", \"A5\": \"" + String(analogRead(A5)) + "\", \"2\": \"" + String(digitalRead(2)) + "\" , \"3\": \"" + String(digitalRead(3)) + "\" , \"4\": \"" + String(digitalRead(4)) + "\" , \"5\": \"" + String(digitalRead(5)) + "\" , \"6\": \"" + String(digitalRead(6)) + "\" , \"7\": \"" + String(digitalRead(7)) + "\" , \"8\": \"" + String(digitalRead(8)) + "\" , \"9\": \"" + String(digitalRead(9)) + "\" , \"10\": \"" + String(digitalRead(10)) + "\" , \"11\": \"" + String(digitalRead(11)) + "\" , \"12\": \"" + String(digitalRead(12)) + "\" , \"13\": \"" + String(digitalRead(13)) + "\" }";
  Serial.println(jsonString);
}