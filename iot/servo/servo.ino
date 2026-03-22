#include <Servo.h>

Servo myServo;

void setup()
{
  myServo.attach(9); // Connect your signal wire to pin 9
}

void loop()
{
  myServo.write(110);
  delay(2000);
  myServo.write(25);
  delay(2000);
  myServo.write(110);
  delay(2000);
  myServo.write(180);
  delay(2000);
}
