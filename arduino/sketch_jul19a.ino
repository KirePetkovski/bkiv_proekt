#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

int greenLed = 7;
int redLed = 8;

MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();

  pinMode(greenLed, OUTPUT);
  pinMode(redLed, OUTPUT);

  // Initialize with red LED on and green LED off
  digitalWrite(greenLed, LOW);
  digitalWrite(redLed, HIGH);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  String cardID = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    cardID += String(rfid.uid.uidByte[i] < 0x10 ? "0" : ""); // Add leading zero if necessary
    cardID += String(rfid.uid.uidByte[i], HEX); // Convert byte to HEX
  }
  cardID.toUpperCase();
  Serial.println(cardID);
  
  rfid.PICC_HaltA();
}

void serialEvent() {
  while (Serial.available()) {
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
