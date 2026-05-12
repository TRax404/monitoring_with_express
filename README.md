# 📊 Monitoring Stack: Express + Loki + Grafana

A streamlined, production-ready template for centralized logging using the Grafana-Loki stack with a TypeScript Express application.

## 🚀 Overview

This project demonstrates how to implement a robust logging architecture. Instead of logs living inside isolated containers, they are streamed to **Loki**, allowing you to query, filter, and visualize them globally via **Grafana**.

### Architecture
- **Express App**: Node.js service using `winston` + `winston-loki` to ship logs.
- **Grafana Loki**: The log aggregation engine (the "Prometheus for logs").
- **Grafana**: The visualization dashboard.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v22+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Logging**: Winston & winston-loki
- **Infrastructure**: Docker & Docker Compose

---

## 🚦 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Spin up the infrastructure
```bash
docker-compose up -d --build
```
This will start:
- App at `http://localhost:3000`
- Loki at `http://localhost:3100`
- Grafana at `http://localhost:3001`

### 2. Configure Grafana
1. Open **Grafana** at [http://localhost:3001](http://localhost:3001).
2. Login (Anonymous Admin is enabled by default in this setup).
3. Navigate to **Connections** > **Data Sources** > **Add data source**.
4. Select **Loki**.
5. Set the URL to `http://loki:3100`.
6. Click **Save & Test**.

---

## 🧪 API Reference

### 1. Root Endpoint
`GET /`
- Logs an "Accessing root endpoint" message.
- Returns a welcome string.

### 2. Dynamic Logger
`GET /test-log?level={level}&message={msg}`
- **Params**:
  - `level`: `info`, `warn`, or `error` (default: `info`)
  - `message`: Your custom message.
- **Example**: `curl "http://localhost:3000/test-log?level=error&message=DatabaseTimeout"`

### 3. Error Simulator
`GET /error`
- Forces an error-level log and returns a 500 status.

---

## 🔍 Visualizing Logs

1. In Grafana, go to the **Explore** tab (Compass icon).
2. Select the **Loki** data source.
3. In the query builder (Label browser), select:
   - Label: `app`
   - Value: `monitoring-app`
4. Click **Run Query**.
5. Switch to **Live** mode to see logs streaming in real-time!

---

## 📁 Project Structure

```text
├── src/
│   ├── index.ts    # Express server & endpoints
│   └── logger.ts   # Winston configuration for Loki
├── docker.compose.yml
├── Dockerfile
└── package.json
```

---

## 📝 License
ISC
