<div align="center">

<img src="https://raw.githubusercontent.com/Anmolpandey23/Rakshak/main/public/Rakshak_logo.png" width="180" alt="RAKSHAK Logo"/>

# RAKSHAK
### Real-time AI-powered Knowledge-driven Safety & Hazard Alert Kit

**"Because Every Life Matters Below Ground."**

![SAMVED 2026](https://img.shields.io/badge/SAMVED-2026-orange?style=for-the-badge)
![MIT VPU University](https://img.shields.io/badge/MIT_VPU-University-blue?style=for-the-badge)
![Team LogicLords](https://img.shields.io/badge/Team-LogicLords-green?style=for-the-badge)
![MIT ADT University](https://img.shields.io/badge/MIT_ADT-University-purple?style=for-the-badge)
![SMC Solapur](https://img.shields.io/badge/SMC-Solapur-red?style=for-the-badge)

[![Frontend](https://img.shields.io/badge/Frontend-Anmolpandey23%2FRakshak-1e90ff?style=flat-square&logo=react)](https://github.com/Anmolpandey23/Rakshak)
[![Backend](https://img.shields.io/badge/Backend-Nityanand2004%2Frakshak--backend-2ecc8a?style=flat-square&logo=node.js)](https://github.com/Nityanand2004/rakshak-backend)
[![Hardware](https://img.shields.io/badge/Hardware-Rahulmalu01%2FSamved-f5a623?style=flat-square&logo=arduino)](https://github.com/Rahulmalu01/Samved)

</div>

---

> *"The most dangerous part of a sanitation worker's job isn't the work — it's the silence that follows when something goes wrong underground."*
> — Team LogicLords, SAMVED Hackathon 2026

---

## 📊 The Crisis — Why RAKSHAK Exists

| Indicator | Data |
|---|---|
| Sewer deaths in India (2019–2023) | ≥ 347 workers |
| Maharashtra deaths (2018–2023) | ≥ 47 confirmed |
| SMC sanitation workers | ~3,200 workers |
| SMC manholes across 102 wards | ~28,000 manholes |
| Workers with zero PPE during entry | ~78% |
| Incidents with zero gas monitoring | >90% |
| Time to unconsciousness at 500 ppm H₂S | < 3 minutes |
| National average emergency response delay | 18–25 minutes |

**RAKSHAK closes the gap between danger and response.**

---

## 🏗️ System Architecture — Three Layers

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 — AI CLOUD COMMAND DASHBOARD                       │
│  React.js · Firebase · AWS · Python AI · GPS Heat Map       │
└────────────────────┬────────────────────────────────────────┘
                     │ ESP8266 Wi-Fi + SIM7600 4G/SMS
┌────────────────────┴────────────────────────────────────────┐
│  LAYER 2 — SMART SITE MONITORING UNIT                       │
│  Multi-depth probe · SAFE/UNSAFE gate · Flood detection     │
└────────────────────┬────────────────────────────────────────┘
                     │ GPIO / I²C / UART
┌────────────────────┴────────────────────────────────────────┐
│  LAYER 1 — SMART SAFETY JACKET (Wearable)                   │
│  5-Gas sensors · HR/SpO₂ · Fall detection · Local alert     │
└─────────────────────────────────────────────────────────────┘
```

**Critical Design Principle:** If the cloud goes down — workers are still protected.
Layers 1 & 2 operate with full local alert capability, zero network required.

---

## 📦 Repository Structure

This project is split across three repositories:

### 🖥️ Frontend — [`Anmolpandey23/Rakshak`](https://github.com/Anmolpandey23/Rakshak)
Real-time supervisor command dashboard
- **Stack:** React.js · WebSocket · Google Maps API · Chart.js
- Live worker cards — gas readings, HR, SpO₂, risk level
- GPS map with manhole risk heat map overlay
- Green / Yellow / Red risk indicators
- Emergency alert panel with supervisor override
- Designed for ≤ 2-hour non-technical training

### ⚙️ Backend + AI — [`Nityanand2004/rakshak-backend`](https://github.com/Nityanand2004/rakshak-backend)
Cloud intelligence and data infrastructure
- **Stack:** Node.js/Express · Firebase · InfluxDB · AWS SQS · Python · scikit-learn
- MQTT data pipeline from ESP8266 to cloud
- AES-256 encryption at rest and in transit
- AI engine: trend analysis · time-to-danger forecasting · biometric anomaly detection
- Twilio SMS gateway for 4G emergency fallback
- Auto-generated daily PDF compliance reports for SMC

### 🔧 Hardware / Firmware — [`Rahulmalu01/Samved`](https://github.com/Rahulmalu01/Samved)
ESP8266 NodeMCU + ESP32-S3 embedded system
- **Stack:** C/C++ · Arduino IDE / PlatformIO · ESP8266WiFi.h
- MQ-Series 5-gas sensor fusion (H₂S, CH₄, CO, NH₃, O₂)
- MAX30102 pulse oximeter · MAX30205 body temp · BMI160 IMU
- DHT22 temperature/humidity · GPS module
- Local alert: 100dB buzzer + vibration motor + RGB LED
- Wi-Fi uplink to cloud; SIM7600 SMS backup

---

## 🔌 Hardware Wiring Diagram

![ESP8266 NodeMCU Wiring Diagram](https://raw.githubusercontent.com/Rahulmalu01/Samved/main/wiring_diagram.jpeg)

> **Components:** ESP8266 NodeMCU · GPS Module · MAX30102 Pulse Sensor · MQ-Series Gas Sensor · DHT22 Temperature/Humidity · VIN 5V Power Supply
>
> **Pin Legend:** 🔴 VIN Power (5V) · ⚫ GND · 🟣 GPS RX (D6/GP1012) · 🟡 Analog Output (A0) · 🟨 I2C SCL (D1/GIO5) · 🟢 Temp/Humidity DA (D-4)

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js · WebSocket · Google Maps API · Chart.js | Real-time supervisor dashboard |
| **Backend** | Node.js/Express · AWS · Firebase · Twilio | API, message queue, SMS fallback |
| **Database** | InfluxDB · Firebase Realtime DB | Time-series sensors + live state |
| **AI / ML** | Python · scikit-learn · TensorFlow Lite · MQTT | Trend analysis, time-to-danger |
| **Embedded** | ESP32-S3 · ESP8266 NodeMCU · C/C++ | Sensor fusion, Wi-Fi uplink |
| **Hardware** | MQ-Series · ME2-O2 · MAX30102 · MAX30205 · BMI160 · DHT22 · GPS | Multi-modal sensing |

---

## ⚡ Key Features

- ✅ **5-Gas Real-Time Detection** — H₂S, CH₄, CO, NH₃, O₂ every 15 seconds at breathing zone
- ✅ **Continuous Health Monitoring** — HR, SpO₂, body temp, fall detection, fully autonomous
- ✅ **< 2 Second Local Alert** — buzzer + vibration + LED, zero network dependency
- ✅ **< 30 Second SMS Escalation** — ESP8266 Wi-Fi primary + SIM7600 4G SMS backup
- ✅ **Automated Pre-Entry Gate** — multi-depth scan → SAFE / CAUTION / UNSAFE decision
- ✅ **AI Predictive Forecasting** — time-to-danger countdown before thresholds are breached
- ✅ **Zero Worker Interaction** — fully autonomous; unconscious workers are still protected
- ✅ **28,000 Manhole Audit Trail** — every entry, scan, alert permanently logged

---

## 🚀 Quick Start

```bash
# 1. Clone all repositories
git clone https://github.com/Anmolpandey23/Rakshak
git clone https://github.com/Nityanand2004/rakshak-backend
git clone https://github.com/Rahulmalu01/Samved

# 2. Flash Hardware (ESP8266 NodeMCU)
cd Samved
# Open in Arduino IDE or PlatformIO
# Configure WiFi credentials and sensor pins in config.h
platformio run --target upload

# 3. Start Backend + AI Engine
cd rakshak-backend
npm install && npm start
pip install -r requirements.txt && python ai_engine.py

# 4. Launch Dashboard
cd Rakshak
npm install && npm start
```

> ⚠️ Configure `.env` with Firebase credentials, InfluxDB URL, Twilio SID/token, and backend API URL before running.

---

## 📜 Compliance & Standards

| Standard | Requirement |
|---|---|
| Manual Scavenging Act 2013 | Reduces human sewer entry through technology |
| OSHA 29 CFR 1910.146 | Pre-entry atmospheric testing + continuous monitoring |
| IS 15258:2002 (BIS) | Indian standard for portable gas detector accuracy |
| DPDPA 2023 | AES-256 encryption for all biometric and GPS worker data |

---

## 👥 Team LogicLords

**MIT ADT University, Pune, Maharashtra**

Presented at **SAMVED Hackathon 2026**
Organized by **MIT VPU University** in collaboration with **Solapur Municipal Corporation**
---

<div align="center">

**RAKSHAK — Because Every Life Matters Below Ground.**

*© 2026 Team LogicLords · MIT ADT University*
*SAMVED Hackathon 2026 · MIT VPU University × Solapur Municipal Corporation*

</div>
