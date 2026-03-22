#include "esp_camera.h"
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <ESP32Servo.h>

// WiFi Settings
const char *ssid = "iphone bryan";
const char *password = "bryan123";

// Define WebSocket server details
const char *websockets_server_host = "172.20.10.8";
const int websockets_server_port = 8000;

// Camera Pins (AI THINKER)
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

// Servo Configuration
#define SERVO_PIN 12
Servo myServo;

using namespace websockets;
WebsocketsClient client;

void captureAndSend()
{
  // Flush the buffers to ensure we get the latest frame
  for (int i = 0; i < 2; i++)
  {
    camera_fb_t *old_fb = esp_camera_fb_get();
    if (old_fb)
    {
      esp_camera_fb_return(old_fb);
    }
  }

  // Now capture the actual frame for sending
  camera_fb_t *fb = esp_camera_fb_get();
  if (fb)
  {
    client.sendBinary((const char *)fb->buf, fb->len);
    esp_camera_fb_return(fb);
    Serial.println("Fresh image sent to FastAPI");
  }
}

void onMessageCallback(WebsocketsMessage message)
{
  String payload = message.data();
  Serial.println("Received command: " + payload);

  if (payload == "CAPTURE")
  {
    captureAndSend();
  }
  else if (payload == "YES")
  {
    Serial.println("Action: Opening (YES)");
    myServo.write(25); // Open position
    delay(5000);
    myServo.write(110); // Return to closed
    client.send("DEPOSITED_OK");
  }
  else if (payload == "NO")
  {
    Serial.println("Action: Rejecting (NO)");
    myServo.write(180); // Reject position
    delay(5000);
    myServo.write(110); // Return to closed
  }
}

void setup()
{
  Serial.begin(115200);

  // --- Servo Setup ---
  ESP32PWM::allocateTimer(0);
  myServo.setPeriodHertz(50);           // Standard 50hz servo
  myServo.attach(SERVO_PIN, 500, 2400); // Attach to GPIO 12
  myServo.write(110);                   // Start in 'Closed' position

  // --- Camera Setup ---
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000; // Lowered to 10MHz for better stability
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA; // Start at the resolution we want to use
  config.jpeg_quality = 20;          // Higher number = Lower quality (Less data to send)
  config.fb_count = 2;               // Increased buffer count to prevent FB-OVF

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK)
  {
    Serial.printf("Camera init failed: 0x%x", err);
    return;
  }

  // --- WiFi & WebSocket ---
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  client.onMessage(onMessageCallback);
  client.setInsecure();
  client.connect(websockets_server_host, websockets_server_port, "/ws");
}

void loop()
{
  client.poll();
  delay(10);
}