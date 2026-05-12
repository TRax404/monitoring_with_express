# Monitoring Project with Loki

This project sets up an Express application that sends logs to Loki.

## Getting Started

1.  **Start the stack:**
    ```bash
    docker-compose up -d --build
    ```

2.  **Access the services:**
    -   **Express App:** http://localhost:3000
    -   **Grafana:** http://localhost:3001 (Default: Admin access enabled)
    -   **Loki:** http://localhost:3100

## Testing APIs

-   **Root:** `GET /` - Logs a simple access message.
-   **Test Log:** `GET /test-log?level=warn&message=WarningMsg` - Logs a custom message at a specific level.
-   **Error:** `GET /error` - Logs an error level message.

## Grafana Configuration

1.  Open Grafana at http://localhost:3001.
2.  Go to **Connections** > **Data Sources**.
3.  Add **Loki**.
4.  Set URL to `http://loki:3100`.
5.  Click **Save & Test**.
6.  Go to **Explore** and select the Loki data source to see logs.
