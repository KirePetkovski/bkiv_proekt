int greenLed = 7;
int redLed = 8;

void setup() {
  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  // Initialize with red LED on and green LED off
  digitalWrite(greenLed, LOW);
  digitalWrite(redLed, HIGH);

  // Start serial communication
  Serial.begin(9600);
}

void loop() {
  // Nothing to do here, we will control the LEDs via serial
}

void serialEvent() {
  Serial.println("New circle");
  while (Serial.available()) {
    Serial.println("in");
    char inChar = (char)Serial.read();
    if (inChar == '1') {
      digitalWrite(greenLed, HIGH);
      digitalWrite(redLed, LOW);
    } else if (inChar == '0') {
      digitalWrite(greenLed, LOW);
      digitalWrite(redLed, HIGH);
    }
  }
}
