#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint
const char* serverUrl = "API_SERVER_URL";

// Data to send
String worker_id = "WORKER_01";
int bpm = 75;
float h2s = 0.5;
float o2 = 20.9;
int alert_level = 0;

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

int sendDataToAPI() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  }

  WiFiClientSecure client;
  client.setInsecure();  // skips certificate validation

  HTTPClient http;

  Serial.println("Sending POST request...");

  if (!http.begin(client, serverUrl)) {
    Serial.println("Failed to connect to server");
    return -1;
  }

  http.addHeader("Content-Type", "application/json");

  // Build JSON manually
  String jsonData = "{";
  jsonData += "\"worker_id\":\"" + worker_id + "\",";
  jsonData += "\"bpm\":" + String(bpm) + ",";
  jsonData += "\"h2s\":" + String(h2s, 2) + ",";
  jsonData += "\"o2\":" + String(o2, 2) + ",";
  jsonData += "\"alert_level\":" + String(alert_level);
  jsonData += "}";

  Serial.println("Payload:");
  Serial.println(jsonData);

  int httpResponseCode = http.POST(jsonData);

  Serial.print("HTTP Response Code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Server Response:");
    Serial.println(response);
  } else {
    Serial.print("POST failed. Error: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  http.end();
  return httpResponseCode;
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  connectWiFi();

  // Retry logic for sleeping free-tier server
  int responseCode = -1;
  int retries = 3;

  for (int i = 1; i <= retries; i++) {
    Serial.print("Attempt ");
    Serial.println(i);

    responseCode = sendDataToAPI();

    if (responseCode == 201) {
      Serial.println("Data safely stored in Firebase via API.");
      break;
    }

    Serial.println("Server may be waking up. Waiting before retry...");
    delay(15000); // wait 15 seconds before retry
  }

  if (responseCode != 201) {
    Serial.println("Failed to store data after retries.");
  }
}

void loop() {
  // Example: send every 30 seconds
  bpm = random(70, 95);
  h2s = random(1, 10) / 10.0;   // 0.1 to 0.9
  o2 = 20.5 + random(0, 5) / 10.0;
  alert_level = (h2s > 0.7 || o2 < 19.5) ? 1 : 0;

  int responseCode = sendDataToAPI();

  if (responseCode != 201) {
    Serial.println("Retry after wake-up delay...");
    delay(15000);
    sendDataToAPI();
  }

  Serial.println("-----------------------------");
  delay(30000);
}