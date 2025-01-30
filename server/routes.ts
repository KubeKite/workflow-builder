import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupWorkflows } from "./workflows";
import { WebSocket, WebSocketServer } from "ws";

export function registerRoutes(app: Express): Server {
  setupAuth(app);
  setupWorkflows(app);

  const server = createServer(app);

  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ 
    server,
    path: "/ws"  // Explicitly define WebSocket path
  });

  wss.on("connection", (ws, req) => {
    // Ignore vite HMR connections
    if (req.headers["sec-websocket-protocol"] === "vite-hmr") {
      return;
    }

    console.log("WebSocket client connected");

    ws.on("message", (message) => {
      try {
        // Handle workflow execution updates
        const data = JSON.parse(message.toString());
        // Broadcast updates to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  return server;
}