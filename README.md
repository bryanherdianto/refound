# ReFound

![Banner GitHub](https://i.imgur.com/t1e7imt.png)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
</p>

## Inspiration

Institutions often unknowingly contribute to the global waste crisis because lost or discarded goods lack a structured redistribution system. This systemic failure in circular consumption means that while institutions generate a high volume of reusable goods, they lack the necessary infrastructure to redirect them. **ReFound** addresses this problem by enabling institutions to convert lost goods into social value through an automated redistribution system, ensuring these items find a second life in local communities instead of ending up as waste.

## What It Does

**ReFound** is a smart donation and redistribution platform that connects donors and recipients in real time.

**How it works (user perspective):**

1. **Users scan a QR code** at a ReFound bin.
2. **Drop off their item** in under a few minutes.
3. **AI verifies item quality** using cameras and uploaded images.
4. **Approved items are listed** on the web platform.
5. **Other users browse, reserve, and schedule pickup**.

## How I built it

### **Smart Bin (Hardware Layer)**

- Built using **IoT devices (ESP32-CAM & Arduino)** to capture and assess items at smart donation bins.
- **Sends real-time data** to the backend for processing.

### **Backend & Data Layer**

- **FastAPI** handles API requests, WebSocket communication, and core system logic.
- **MongoDB & AWS S3** serve as the primary data and image storage layers.

### **AI Integration**

- **Google Gemini Pro Vision** assists with automated **item recognition**, **category classification**, and **quality assessment**.

### **Frontend Platform**

- Built with **Next.js**, allowing users to browse verified items, reserve them, and manage their donation history.
- **Google Maps API** enables location-based discovery and pickup coordination.

## Challenges I ran into

- **System Integration:** Connecting multiple technologies (**IoT, Backend, AI, and Frontend**) smoothly under a tight **24-hour time constraint**.
- **Hardware Handshaking:** Troubleshooting **WebSocket connections** and real-time data synchronization between physical bins and the cloud.
- **Production Readiness:** Completing a functioning end-to-end product and a presentation pitch within a hackathon timeframe.

## Accomplishments that I'm proud of

- **Functional End-to-End Product:** Successfully built a full-stack system that solves a tangible real-world problem.
- **Impactful Innovation:** Developed a real-world solution addressing **sustainability** and **resource accessibility**.

## What I learned

- **Cross-Domain Integration:** Harmonizing technologies across different domains into one cohesive, automated system.
- **Technical Resilience:** Adapting quickly when facing hardware constraints and networking challenges.
- **Agile Scoping:** Managing time effectively by focusing on **problem scoping** and defining core features clearly.

## What's Next for ReFound

- **Enhanced IoT Optics**: Upgrade the camera module to replace current low-resolution sensors for better AI accuracy.
- **Scaleable Capacity**: Increase the physical capacity of the bins to accommodate a larger volume of donations.
- **Protective Enclosures**: Design durable, **weather-resistant housing** for the camera and servo components.
- **Advanced Security**: Implement anti-vandalism measures and secure authentication for item drop-offs.
- **Infrastructure Scaling**: Optimize the backend to handle high-resolution data and increased concurrent user traffic.
- **Public Expansion**: ReFound aims to expand beyond universities into **airports, transit hubs, and public stations**, maximizing social impact and resource-sharing for everyone.
