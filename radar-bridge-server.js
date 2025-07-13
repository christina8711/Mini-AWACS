const dgram = require("dgram");
const express = require("express");
const cors = require("cors");

const UDP_PORT = 5005;
const HTTP_PORT = 3001;
const HOST = "0.0.0.0";

let latestRadarData = null;

// Setup UDP server to receive radar data
const udpServer = dgram.createSocket("udp4");

udpServer.on("message", (msg) => {
  try {
    const parsed = JSON.parse(msg.toString());
    latestRadarData = {
      radarPoints: [
        {
          azimuth: parsed.azimuth_degrees,
          range: parsed.range_nm,
          type: "drone",
          alt: 100,
        },
      ],
      plane: {
        lat: 28.5,
        lon: -81.2,
        alt: 10000,
      },
    };
    console.log("✅ Received radar packet:", parsed.azimuth_degrees, "°");
  } catch (e) {
    console.error("❌ Failed to parse incoming radar data:", e.message);
  }
});

udpServer.bind(UDP_PORT, HOST, () => {
  console.log(`📡 UDP server listening on ${HOST}:${UDP_PORT}`);
});

// Setup HTTP API to serve radar data
const app = express();
app.use(cors());

app.get("/api/radar", (req, res) => {
  if (latestRadarData) {
    res.json(latestRadarData);
  } else {
    res.status(503).json({
      radarPoints: [],
      message: "No radar data received yet",
    });
  }
});

app.listen(HTTP_PORT, HOST, () => {
  console.log(`🌐 API server running at http://${HOST}:${HTTP_PORT}/api/radar`);
});
