#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* awsEndpoint = "YOUR_AWS_IOT_ENDPOINT"; // e.g., abc123xyz-ats.iot.us-east-1.amazonaws.com
const char* topic = "sensors/temperature";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    client.setServer(awsEndpoint, 8883); // MQTT over TLS
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    // Simulate sensor data
    float temperature = readTemperature(); // Replace with actual sensor reading
    String payload = "{\"temperature\":" + String(temperature) + "}";
    client.publish(topic, payload.c_str());
    delay(5000); // Send data every 5 seconds
}

void reconnect() {
    while (!client.connected()) {
        Serial.println("Connecting to AWS IoT...");
        if (client.connect("ESP32Client")) {
            Serial.println("Connected to AWS IoT");
        } else {
            Serial.print("Failed, rc=");
            Serial.print(client.state());
            Serial.println(" Retrying in 5 seconds...");
            delay(5000);
        }
    }
}

void callback(char* topic, byte* payload, unsigned int length) {
    // Handle incoming messages (if needed)
}

float readTemperature() {
    // Replace with actual sensor reading logic
    return 25.0 + (rand() % 10); // Simulated temperature
}