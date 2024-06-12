#include "MPU9250.h"
#include <Wire.h>
#include "MAX30105.h"

#include "heartRate.h"

#include <WiFi.h>
#include <HTTPClient.h>
HTTPClient http;

// Wifi
const char* ssid = "Nice";
const char* password = "11111111";

MAX30105 particleSensor;

const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;

// an MPU9250 object with the MPU-9250 sensor on I2C bus 0 with address 0x68
MPU9250 IMU(Wire, 0x68);
int status;

String url = "192.168.0.3";


// variable
int ir,bpm,muscle;
float acelX,acelY,acelZ,gyroX,gyroY,gyroZ,magX,magY,magZ,temp;

void setup() {
  // serial to display data
  Serial.begin(115200);

  Serial.println("Initializing...");

  // Wifi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize sensor MAX302
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED

  while (!Serial) {}

  // start communication with IMU
  status = IMU.begin();
  if (status < 0) {
    Serial.println("IMU initialization unsuccessful");
    Serial.println("Check IMU wiring or try cycling power");
    Serial.print("Status: ");
    Serial.println(status);
    while (1) {}
  }
}

void loop() {
  max302();
  muscleSensor();
  imu();
  delay(1500);
  send();
}

void  max302(){
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }

  ir = irValue;
  bpm = beatAvg;

  Serial.println("***********************");
  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print("| BPM=");
  Serial.print(beatsPerMinute);
  Serial.print("| Avg BPM=");
  Serial.print(beatAvg);

  if (irValue < 50000)
    Serial.print(" No finger?");

  Serial.println("");
  Serial.println("***********************");
}

void  muscleSensor(){
  float sensorValue = analogRead(13);
  float millivolt = (sensorValue/1023)*5;

  muscle = sensorValue;
  
  Serial.print("Sensor Value: ");
  Serial.print(sensorValue);
  Serial.print("| Voltage: ");
  Serial.print(millivolt*1000);
  Serial.println(" mV");
  Serial.println("***********************");
}

void imu(){
  // read the sensor
  IMU.readSensor();
  acelX = IMU.getAccelX_mss();
  acelY = IMU.getAccelY_mss();
  acelZ = IMU.getAccelZ_mss();
  gyroX = IMU.getGyroX_rads();
  gyroY = IMU.getGyroY_rads();
  gyroZ = IMU.getGyroZ_rads();
  magX = IMU.getMagX_uT();
  magY = IMU.getMagY_uT();
  magZ = IMU.getMagZ_uT();
  temp = IMU.getTemperature_C(), 2;
  // display the data
  Serial.print("AcelX : ");
  Serial.print(IMU.getAccelX_mss(), 6);
  Serial.print("| AcelY : ");
  Serial.print(IMU.getAccelY_mss(), 6);
  Serial.print("| AcelZ : ");
  Serial.print(IMU.getAccelZ_mss(), 6);
  Serial.print("| GyroX : ");
  Serial.print(IMU.getGyroX_rads(), 6);
  Serial.print("| GyroY : ");
  Serial.print(IMU.getGyroY_rads(), 6);
  Serial.print("| GyroZ : ");
  Serial.print(IMU.getGyroZ_rads(), 6);
  Serial.print("| MaglX : ");
  Serial.print(IMU.getMagX_uT(), 6);
  Serial.print("| MaglY : ");
  Serial.print(IMU.getMagY_uT(), 6);
  Serial.print("| MaglZ : ");
  Serial.print(IMU.getMagZ_uT(), 6);
  Serial.print("| Temp : ");
  Serial.println(IMU.getTemperature_C(), 6);
}

void send(){
   // Alamat API yang dituju
    String serverAddress = "https://"+url+"/sportFlux/api/insertData.php?ir="+ir+"&bpm="+bpm+"&acelX="+acelX+"&acelY="+acelY+"&acelZ="+acelZ+"&gyroX="+gyroX+"&gyroY="+gyroY+"&gyroZ="+gyroZ+"&magX="+magX+"&magY="+magY+"&magZ="+magZ+"&temp="+temp+"&muscle="+muscle+"&_csrf_token=Z038OpTDXX";

    http.begin(serverAddress);  // Mulai koneksi ke server

    // Lakukan GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString(); // Dapatkan respons dari server
      Serial.println(response);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end(); // Selesai dengan koneksi HTTP
}