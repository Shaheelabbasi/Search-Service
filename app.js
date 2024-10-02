const express = require('express');
const { productRouter } = require('./Routes/product.router.js');
const client = require('prom-client');
const path = require("path");
const app = express();
const cors = require("cors");

// Set up CORS
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Set up Prometheus metrics collection
const register = new client.Registry();

// Track total number of HTTP requests
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
});

// Track response duration for each route
const httpResponseDuration = new client.Histogram({
    name: 'http_response_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10], // Customize buckets as needed
});

// Track memory usage per route
const memoryUsageGauge = new client.Gauge({
    name: 'memory_usage_bytes',
    help: 'Memory usage in bytes per route',
    labelNames: ['route'],
});

// Track CPU usage per route
const cpuUsageGauge = new client.Gauge({
    name: 'cpu_usage_seconds',
    help: 'CPU usage in seconds per route',
    labelNames: ['route'],
});

// Register custom metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpResponseDuration);
register.registerMetric(memoryUsageGauge);
register.registerMetric(cpuUsageGauge);

// Collect default metrics (e.g., memory usage, process info)
client.collectDefaultMetrics({ register });

// Middleware to track metrics for each route
const metricsMiddleware = (req, res, next) => {
    // Start tracking CPU usage at the start of the request
    const startCpuUsage = process.cpuUsage();

    // Start the timer to measure response duration
    const endTimer = httpResponseDuration.startTimer({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status: res.statusCode
    });

    // Listen for when the response has finished
    res.on('finish', () => {
        const routePath = req.route ? req.route.path : req.path;

        // Increment HTTP request counter based on the route
        httpRequestCounter.inc({
            method: req.method,
            route: routePath,
            status: res.statusCode
        });

        // End the timer and log response duration
        endTimer({
            method: req.method,
            route: routePath,
            status: res.statusCode
        });

        // Update memory usage per route
        memoryUsageGauge.set({
            route: routePath
        }, process.memoryUsage().heapUsed);

        // Calculate CPU usage and update the gauge
        const endCpuUsage = process.cpuUsage(startCpuUsage);
        const cpuUsageInSeconds = (endCpuUsage.user + endCpuUsage.system) / 1e6; // Convert from microseconds to seconds
        cpuUsageGauge.set({
            route: routePath
        }, cpuUsageInSeconds);

        // console.log(`Processed request: ${req.method} ${routePath} with status ${res.statusCode}`);
        // console.log(`Memory usage for ${routePath}: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
        // console.log(`CPU usage for ${routePath}: ${cpuUsageInSeconds} seconds`);
    });

    next();
};

// Use the metrics middleware for all routes
app.use(metricsMiddleware);

// Expose /metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Set up JSON and URL-encoded form body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/Public", express.static(path.join(__dirname, 'Public')));

// Routers
app.use('/mart', productRouter);

module.exports = app;
