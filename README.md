# OTP Service

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![MIT License](https://img.shields.io/badge/License-MIT-FF5722)

The **OTP Service** is a high-performance, secure Node.js-based API that automates the generation and verification of One-Time Passwords via email. Featuring a professional dark-themed landing page and built-in spam protection, it’s designed for seamless integration into 2FA or passwordless login flows.

## 🚀 Key Features

- **No API Key Required**: Publicly accessible endpoints for quick integration.
- **Professional Dashboard**: Stunning dark-themed landing page with Lucide icons.
- **Flexible OTP Types**: Numeric or alphanumeric configurations.
- **Auto-Expiration**: Configurable validity periods (Default: 2 minutes).
- **Spam Protection**: Built-in IP/Email blocklisting and keyword filtering.
- **Customizable Delivery**: Personalized organization names and subjects in emails.

## 📋 Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Spam Detection](#spam-detection)
- [License](#license)

## 🛠️ Getting Started

### Prerequisites

| Prerequisite | Description |
| :--- | :--- |
| **Node.js** | Version 18.x or higher |
| **MongoDB** | A valid MongoDB URI (Atlas or Local) |
| **SMTP Server** | Gmail or any SMTP-compatible email service |

> [!TIP]
> **Universal Access**: To allow the service to connect from anywhere (like Vercel or Render), go to MongoDB Atlas -> Network Access -> Add IP Address: `0.0.0.0/0`.

### Installation

1. **Clone the repository**:
   ```shell
   git clone https://github.com/sauravhathi/otp-service.git
   cd otp-service
   ```

2. **Install dependencies**:
   ```shell
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file from the example:
   ```shell
   cp .env.example .env
   ```

4. **Build & Start**:
   ```shell
   npm run build
   npm start
   ```

## 📡 Usage

### 1. Generating an OTP
Generate a secure code and send it to a user's email.

**Endpoint**: `POST /api/otp/generate`

**Payload**:
```json
{
  "email": "user@gmail.com",
  "organization": "My Secure App",
  "subject": "Your Verification Code",
  "type": "numeric"
}
```

### 2. Verifying an OTP
Validate the code provided by the user.

**Endpoint**: `POST /api/otp/verify`

**Payload**:
```json
{
  "email": "user@gmail.com",
  "otp": "482916"
}
```

## ⚙️ Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | 3000 | Server port |
| `MONGODB_URI` | - | MongoDB Connection String |
| `OTP_VALIDITY_PERIOD_MINUTES` | 2 | Expiration time |
| `OTP_SIZE` | 6 | Code length |
| `GMAIL_USER` / `GMAIL_PASS` | - | SMTP credentials |

## 🛡️ Spam Detection

The service automatically blocks requests containing keywords defined in `BLOCK_KEYWORDS_RULES`. IPs found abusing the service are cached and blocked for 60 seconds to prevent DDoS and spamming.

## 🖋️ License

Distributed under the MIT License. Built with ❤️ by **Eswar Chinthakayala**.
