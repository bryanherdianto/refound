## IOT

This project utilizes the following hardware components and materials:

- **ESP32-CAM**: The primary microcontroller and camera module.
- **Servo Motor**: Used for mechanical flipping or sorting actions.
- **Arduino Uno**: Primarily functions as a power supply and communication interface for programming.
- **Jumper Wires**: For establishing electrical connections between components.
- **Plastic Bucket**: Serves as the main container for the sorting system.
- **Cartons and Metal Rods**: Used for structural support and frame construction.

### Programming and Configuration

The schematic below illustrates the **Upload Mode** for the ESP32-CAM. In this configuration, the Arduino Uno acts as a USB-to-Serial bridge and provides the necessary power supply to program the ESP32.
![picture 0](https://i.imgur.com/gUHYUia.png)

For standard operation, refer to the **Normal Operation Mode** schematic. This setup ensures the ESP32-CAM runs the flashed firmware independently.
![picture 1](https://i.imgur.com/Phfi3Lq.png)

### System Integration

The following diagram shows the **Full Schematic** of the ESP32-CAM integrated with the servo motors. The servo is connected to **GPIO 12**, and the Arduino continues to serve as a stable power source for the entire module.
![picture 2](https://i.imgur.com/rBAXkID.png)

When uploading firmware, it is critical to use a lower baud rate to ensure data integrity; a **115200 baud rate** is recommended. Additionally, the following IDE settings were used:

- **Flash Mode**: DIO
- **Flash Frequency**: 40MHz
- **PSRAM**: Enabled
- **Partition Scheme**: Huge APP (3MB No OTA/1MB SPIFFS)
  ![picture 3](https://i.imgur.com/kpHeew5.png)

### Physical Assembly

Once the electronics are verified, they are integrated into the plastic bucket. The **Servo Motor** is securely attached to the lid, while the **ESP32-CAM** is positioned at the top. The camera is oriented **downwards** to capture images of items placed within the bucket. These images are transmitted to the backend for analysis, which then triggers the servo to flip the lid in the appropriate direction based on the classification results.
![picture 4](https://i.imgur.com/c5E1qy0.jpeg)
