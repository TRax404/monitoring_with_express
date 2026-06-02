# 📊 Monitoring Stack: Express + Loki + Grafana

A streamlined, production-ready template for centralized logging and performance monitoring using the Grafana-Loki stack with a TypeScript Express application.

## 🚀 Overview

This project demonstrates a robust logging and observability architecture. Beyond simple log collection, it implements **performance tracking** and **reliability testing** by capturing request metadata, latency, and status codes.

### Architecture
- **Express App**: Node.js service using `winston` + `winston-loki` for structured logging.
- **Grafana Loki**: Log aggregation engine that indexes metadata for high-performance querying.
- **Grafana**: Advanced visualization for logs, error rates, and latency distribution.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v22+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Logging**: Winston & winston-loki
- **Infrastructure**: Docker & Docker Compose

---

## 🚦 Getting Started

### 1. Spin up the infrastructure
```bash
docker-compose up -d --build
```
- **App**: `http://localhost:3000`
- **Loki**: `http://localhost:3100`
- **Grafana**: `http://localhost:3001`

### 2. Monitoring Configuration
The project comes with **automatic provisioning**. Grafana is pre-configured with the Loki datasource and a default dashboard.

---

## 🧪 Monitoring & Test Endpoints

Use these endpoints to generate data and verify your monitoring dashboards.

### 📈 Performance & Latency
Testing how your system handles different delay profiles:
- `GET /test/latency?dist=normal`: Simulates typical latency (100ms - 500ms).
- `GET /test/latency?dist=slow`: Simulates a slow backend (2s - 5s).
- `GET /test/latency?dist=flaky`: Simulates intermittent issues (20% chance of 5s delay).
- `GET /delay?ms=1000`: Fixed delay testing.

### 🚨 Error Rate & Reliability
Testing how your alerting handles failure scenarios:
- `GET /test/error-rate?rate=0.7`: Controlled failure simulation (70% failure rate).
- `GET /test/not-found`: Triggers a `404 Not Found` warning.
- `GET /test/unauthorized`: Triggers a `401 Unauthorized` warning.
- `GET /error`: Triggers a standard `500 Internal Server Error`.

### 📦 Payload Testing
- `GET /test/heavy?size=2000`: Generates a large JSON response (approx 2MB) to test bandwidth and content-length logging.

---

## 🔍 Observability Metrics

The application logs structured JSON data. You can query these metrics in Grafana using **LogQL**:

### Average Request Time (Latency)
```logql
avg_over_time({app="monitoring-app"} | json | unwrap duration [5m])
```

### Error Count by Status Code
```logql
sum by (status) (count_over_time({app="monitoring-app"} | json | status =~ "5.." [1m]))
```

### 95th Percentile Latency
```logql
quantile_over_time(0.95, {app="monitoring-app"} | json | unwrap duration [5m])
```

---

## 📁 Project Structure

```text
├── src/
│   ├── index.ts    # Express server & enhanced monitoring routes
│   └── logger.ts   # Winston structured logging config
├── grafana/
│   ├── provisioning/ # Auto-config for datasources & dashboards
│   └── dashboards/   # Pre-built monitoring dashboards
├── docker.compose.yml
└── Dockerfile
```

---

## 📝 License
ISC
